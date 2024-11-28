import { NextResponse } from 'next/server';
import { db } from '../../firebase/clientApp';
import sortPlayers from '@/app/functions/sortPlayers';
import closeVotes from '@/app/functions/closeVotes';
import { Timestamp, collection, query, where, getDocs } from 'firebase/firestore'; // Firestore v9+ modular imports

// Global flag to prevent concurrent executions
let isProcessing = false;

async function closeVotesForGame(matchId) {
  try {
    const sortedPlayers = await sortPlayers(matchId);
    await closeVotes(matchId, sortedPlayers);
    console.log(`${matchId} closed successfully`);
  } catch (err) {
    console.error(`Error closing votes for match ${matchId}:`, err);
  }
}

const collectionName = 'games';
const fieldName = 'closedVotes';
const fieldValue = false;

export async function POST() {
  // Check if a process is already running
  if (isProcessing) {
    console.log('Request ignored: Process already running');
    return NextResponse.json({ message: 'Process already running' }, { status: 429 }); // Too Many Requests
  }

  // Set the flag to indicate the process is running
  isProcessing = true;

  try {
    const collectionRef = collection(db, collectionName);

    // Create a query with the 'where' conditions and timestamp check
    const q = query(
      collectionRef,
      where(fieldName, '==', fieldValue),
      where('endDate', '<=', Timestamp.fromDate(new Date())) // Filter based on the endDate
    );

    // Fetch documents that match the query
    const querySnapshot = await getDocs(q);

    // Map through the documents and extract the necessary data
    const documents = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    console.log('Fetched documents:', documents);

    const gamesToClose = documents;

    // Use Promise.all to close votes for all the games in parallel
    const closePromises = gamesToClose.map((game) =>
      closeVotesForGame(game.docId).catch((err) => {
        console.error(`Failed to close votes for game ${game.docId}:`, err);
      })
    );

    await Promise.all(closePromises);

    // Return the documents in the response
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    // Reset the flag once processing is complete
    isProcessing = false;
  }
}

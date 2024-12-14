import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

const db = admin.firestore();

export async function POST(req) {
    const { playerId, matchId } = await req.json(); // Fixed typo: `receiver` instead of `reciver`

    // Validate required fields
    if (!playerId || !matchId) {
        console.log(sender, matchId)
        return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
    }


    try {
        await addPlayer(playerId, matchId);

        return NextResponse.json({ message: 'Player added successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing transaction:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

async function addPlayer(playerId, matchId) {
    try {
        const MATCHES_COLLECTION = 'games';
        const matchRef = db.collection(MATCHES_COLLECTION).doc(matchId);

        // Fetch the match document
        const docSnapshot = await matchRef.get();

        if (docSnapshot.exists) {
            // add player to the match
            const matchData = docSnapshot.data();
            const updatedPlayers = [...matchData.players, {uid: playerId}];
            await matchRef.update({ players: updatedPlayers });
            console.log('Player added to the match');

        } else {
            console.log('Match does not exist');
        }
    } catch (error) {
        console.error('Error adding player to the match:', error);
        throw error; // Rethrow to handle in the caller
    }
}


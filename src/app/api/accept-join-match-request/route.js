import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { getCurrentUser } from '@/lib/auth';

const db = admin.firestore();

export async function POST(req) {
    const { playerId, matchId } = await req.json(); // Fixed typo: `receiver` instead of `reciver`

    const user = await getCurrentUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Validate required fields
    if (!playerId || !matchId) {
        console.log(sender, matchId)
        return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
    }


    try {
        await addPlayer(playerId, matchId);

        // send notification to the added player
        await createNotification(user.uid, playerId, 'join-match-accept', 'تمت اضافاتك للمباريه', matchId);

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


async function createNotification(sender, receiver, type, message, matchId) {
    try {
        const NOTIFICATIONS_COLLECTION = 'notifications';
        const notificationRef = db.collection(NOTIFICATIONS_COLLECTION).doc(`${sender}_${matchId}`);

        await notificationRef.set({
            sender,
            receiver, // No need to repeat `receiver: receiver`
            type,
            message,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
            matchId: matchId || null,
            status: 'pending',
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error; // Rethrow to handle in the caller
    }
}

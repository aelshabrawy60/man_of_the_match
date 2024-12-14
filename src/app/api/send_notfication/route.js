import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

const db = admin.firestore();

export async function POST(req) {
    const { sender, receiver, type, message, matchId } = await req.json(); // Fixed typo: `receiver` instead of `reciver`

    // Validate required fields
    if (!sender || !receiver || !type || !message) {
        console.log(sender, receiver, type, message, matchId)
        return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
    }

    try {
        await createNotification(sender, receiver, type, message, matchId);

        return NextResponse.json({ message: 'Notification sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing transaction:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
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

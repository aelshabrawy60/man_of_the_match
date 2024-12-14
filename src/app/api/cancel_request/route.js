import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

const db = admin.firestore();

export async function POST(req) {
    const { sender, matchId } = await req.json(); // Fixed typo: `receiver` instead of `reciver`

    // Validate required fields
    if (!sender || !matchId) {
        console.log(sender, matchId)
        return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
    }


    try {
        await deleteNotification(sender, matchId);

        return NextResponse.json({ message: 'Notification deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing transaction:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

async function deleteNotification(sender, matchId) {
    try {
        const NOTIFICATIONS_COLLECTION = 'notifications';
        const notificationRef = db.collection(NOTIFICATIONS_COLLECTION).doc(`${sender}_${matchId}`);

        // Fetch the notification document
        const docSnapshot = await notificationRef.get();

        // Check if the document exists and the status is not "refused"
        if (docSnapshot.exists) {
            const notificationData = docSnapshot.data();
            if (notificationData.status !== 'refused') {
                // Proceed with deleting the notification if status is not "refused"
                await notificationRef.delete();
                console.log('Notification deleted');
            } else {
                console.log('Notification status is refused, cannot delete');
            }
        } else {
            console.log('Notification does not exist');
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error; // Rethrow to handle in the caller
    }
}


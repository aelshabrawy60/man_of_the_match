import { getCurrentUser } from '@/lib/auth';
import { getUserCoins, deductCoins } from '@/lib/coins-manager';
import admin from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

const db = admin.firestore();

export async function POST(req) {
    const { phoneNumber, amount } = await req.json();

    console.log(phoneNumber, amount, "test")
    if (!phoneNumber || !/^[0-9]+$/.test(phoneNumber)) {
        return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
    }

    const user = await getCurrentUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCoins = await getUserCoins(user.uid);

    try {
        if (userCoins >= amount) {
            await deductCoins(user.uid, amount);

            const TRANSACTIONS_COLLECTION = 'transactions';
            const transactionRef = db.collection(TRANSACTIONS_COLLECTION).doc();
            await transactionRef.set({
                amount,
                phoneNumber,
                status: 'pending',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return NextResponse.json({ 
                transaction: { success: true, message: 'Transaction successful' },
            });
        } else {
            return NextResponse.json(
                { message: 'Insufficient coins' }, { status: 400 },
            );
        }
    } catch (error) {
        console.error('Error processing transaction:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

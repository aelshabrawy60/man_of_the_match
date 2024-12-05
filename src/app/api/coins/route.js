import { NextResponse } from 'next/server';
import { getUserCoins, addCoins, deductCoins, getTopUsers } from '@/lib/coins-manager';
import { getCurrentUser } from '@/lib/auth';

// Get user's coins
export async function GET(req) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const coins = await getUserCoins(user.uid);
    return NextResponse.json({ coins });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add coins to user
export async function POST(req) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount } = await req.json();
    await addCoins(user.uid, amount);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Deduct coins from user
export async function PUT(req) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount } = await req.json();
    await deductCoins(user.uid, amount);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

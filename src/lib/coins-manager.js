import admin from './firebase-admin';

const db = admin.firestore();
const PLAYERS_COLLECTION = 'players';

export async function getUserCoins(userId) {
  try {
    const userDoc = await db.collection(PLAYERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) {
      return 0;
    }
    return userDoc.data().coins || 0;
  } catch (error) {
    console.error('Error getting user coins:', error);
    throw error;
  }
}

export async function addCoins(userId, amount) {
  try {
    const ref = db.collection(PLAYERS_COLLECTION).doc(userId);
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        throw new Error('Player document not found');
      }
      const userData = doc.data();
      const newCoins = (userData.coins || 0) + amount;
      transaction.update(ref, {
        coins: newCoins,
        lastCoinsUpdate: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    return true;
  } catch (error) {
    console.error('Error adding coins:', error);
    throw error;
  }
}

export async function deductCoins(userId, amount) {
  try {
    const ref = db.collection(PLAYERS_COLLECTION).doc(userId);
    let success = false;
    
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        throw new Error('Player document not found');
      }
      const userData = doc.data();
      const currentCoins = userData.coins || 0;
      
      if (currentCoins < amount) {
        throw new Error('Insufficient coins');
      }
      
      transaction.update(ref, {
        coins: currentCoins - amount,
        lastCoinsUpdate: admin.firestore.FieldValue.serverTimestamp()
      });
      success = true;
    });
    
    return success;
  } catch (error) {
    console.error('Error deducting coins:', error);
    throw error;
  }
}

export async function getTopUsers(limit = 10) {
  try {
    const snapshot = await db.collection(PLAYERS_COLLECTION)
      .orderBy('coins', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data(),
      // Only return necessary fields
      name: doc.data().name,
      coins: doc.data().coins || 0,
      photoUrl: doc.data().photoUrl
    }));
  } catch (error) {
    console.error('Error getting top users:', error);
    throw error;
  }
}

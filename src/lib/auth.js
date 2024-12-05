import admin from './firebase-admin';

export async function authenticateUser(req) {
  try {
    // Get token from cookie
    const authToken = req.cookies.get('authToken')?.value;
    if (!authToken) {
      return null;
    }
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    return decodedToken;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getCurrentUser(req) {
  const user = await authenticateUser(req);
  return user;
}

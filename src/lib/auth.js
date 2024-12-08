import admin from './firebase-admin';



export async function authenticateUser(req) {

  try {
    // Get token from cookie
    const authToken = req.cookies.get('authToken')?.value;
    if (!authToken) {
      return null;
    }
    
    try {
      // First try to verify the token
      const decodedToken = await admin.auth().verifyIdToken(authToken);
      return decodedToken;
    } catch (error) {
      if (error.code === 'auth/id-token-expired') {
        // If token is expired, try to verify with checkRevoked option
        // This will force a token refresh if the user's session is still valid
        const decodedToken = await admin.auth().verifyIdToken(authToken, true);
        return decodedToken;
      }
      throw error; // Re-throw if it's not an expiration error
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getCurrentUser(req) {
  const user = await authenticateUser(req);
  return user;
}

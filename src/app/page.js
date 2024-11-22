"use client"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/clientApp" // Import the useRouter hook
import { useEffect } from "react";
import Link from "next/link";


export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.displayName || "User"}!</h1>
        <p>Email: {user.email}</p>
        <p>UID: {user.uid}</p>
        {user.photoURL && <img src={user.photoURL} alt="User Avatar" />}
        <Link href={'./Matches'}>mathces</Link>
      </div>
    );
  }

  return <p>No user is signed in.</p>;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import dynamic from "next/dynamic";

// Dynamically import Firebase methods only on the client-side
const signUpWithEmail = dynamic(() => import("../../utility/auth").then(mod => mod.signUpWithEmail), { ssr: false });
const loginWithEmail = dynamic(() => import("../../utility/auth").then(mod => mod.loginWithEmail), { ssr: false });
const signInWithGoogle = dynamic(() => import("../../utility/auth").then(mod => mod.signInWithGoogle), { ssr: false });

import { db } from "../firebase/clientApp"; // Import Firebase and Firestore
import { doc, setDoc } from "firebase/firestore"; // For Firestore document operations
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For capturing name during sign-up
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const router = useRouter(); // Initialize useRouter

  // Create a Firestore document for the new user
  async function creatUserDoc(user) {
    const userRef = doc(db, "players", user.uid); // Create reference to player's document
    await setDoc(userRef, {
      name: user.name || "Unknown", // Ensure name is not undefined
      uid: user.uid,
      email: user.email,
      profilePhoto: user.photoURL,
      createdAt: new Date(),
      games: [], // Initialize games as empty array
    });
  }

  // Handle email-based authentication
  const handleEmailAuth = async () => {
    try {
      if (isLogin) {
        const user = await loginWithEmail(email, password);
        console.log("Logged in user:", user);
      } else {
        // On sign-up, pass name along with email and password
        const user = await signUpWithEmail(email, password);

        // Set the name in the user object before passing it to Firestore
        const userWithName = { ...user, name };

        // Create Firestore document for the user
        await creatUserDoc(userWithName);

        console.log("Signed up user:", userWithName);
      }
      // Redirect to Matches page after success
      router.push("/Matches");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google sign-in
  const handleGoogleAuth = async () => {
    try {
      const user = await signInWithGoogle();

      // If user.displayName is available, use it; otherwise, fall back to email or default
      const userWithName = {
        ...user,
        name: user.displayName || user.email || "Unknown", // Default to email if displayName is null
      };

      await creatUserDoc(userWithName); // Create user document after Google sign-in
      console.log("Google signed-in user:", userWithName);

      // Redirect to Matches page after success
      router.push("/Matches");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1 className="mb-5">{isLogin ? "تسجيل الدخول" : "انشاء حساب جديد"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {/* Show name input field only for sign-up */}
        {!isLogin && (
          <>
            <label className="mb-3">الاسم</label>
            <input
              className="mb-4"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ادخل اسمك"
              style={{
                display: "block",
                marginBottom: "10px",
                width: "100%",
              }}
            />
          </>
        )}

        <label className="mb-3">البريد الالكتروني</label>
        <input
          className="mb-4"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ادخل البريد الالكتروني"
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <label className="mb-3">كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ادخل كلمة المرور"
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <div className="d-flex gap-4 mt-4">
          <button className="main-btn" onClick={handleEmailAuth} style={{ marginRight: "10px" }}>
            {isLogin ? "دخول" : "انشاء"}
          </button>

          <button style={{ background: "none", border: "none" }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "انشاء حساب جديد" : "لدي حساب بالفعل"}
          </button>
        </div>
      </div>
      <hr className="mb-4 mt-4" />
      <button className="google-btn fs-5" onClick={handleGoogleAuth} style={{ marginTop: "10px" }}>
        sign in with google <FcGoogle className="me-2 fs-4" />
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { signUpWithEmail, loginWithEmail, signInWithGoogle } from "../../utility/auth";
import { db } from "../firebase/clientApp"; // Import Firebase and Firestore
import { doc, setDoc, getDoc } from "firebase/firestore"; // For Firestore document operations
import { FcGoogle } from "react-icons/fc";
import Login from "@/Components/Login/Login";
import Cookies from "js-cookie";


export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For capturing name during sign-up
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter(); // Initialize useRouter

  // Function to create or update the Firestore document for a user
  async function creatUserDoc(user) {
    const userRef = doc(db, "players", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        name: user.name || "Unknown", // Ensure name is not undefined
        uid: user.uid,
        email: user.email,
        profilePhoto: user.photoURL,
        createdAt: new Date(),
        games: [], // Initialize games as an empty array
      });
    }
  }

  // Handle email-based authentication
  const handleEmailAuth = async () => {
    setIsLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await loginWithEmail(email, password);
        console.log("Logged in user:", user);
      } else {
        // On sign-up, pass name along with email and password
        user = await signUpWithEmail(email, password);
        const userWithName = { ...user, name };
        await creatUserDoc(userWithName);
        console.log("Signed up user:", userWithName);
      }
  
      // Retrieve and store the auth token
      const token = await user.getIdToken(); // Firebase method to get ID token
      Cookies.set("authToken", token, { expires: 365 * 10 }); // Cookie expires in 1 day
  
      // Redirect to Matches page after success
      router.push("/Matches");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      console.time("Google Sign-in");
      const user = await signInWithGoogle();
      console.timeEnd("Google Sign-in");
  
      // Retrieve and store the auth token
      const token = await user.getIdToken(); // Firebase method to get ID token
      Cookies.set("authToken", token, { expires: 1 }); // Cookie expires in 1 day
  
      // Redirect immediately
      console.time("Redirect to Matches");
      router.push("/Matches");
      console.timeEnd("Redirect to Matches");
  
      // Run Firestore document creation in the background
      console.time("User Document Creation");
      const userWithName = {
        ...user,
        name: user.displayName || user.email || "Unknown",
      };
      creatUserDoc(userWithName); // No need to await
      console.timeEnd("User Document Creation");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div className="login-container m-md-auto w-100" style={{ maxWidth: "600px", position: "relative", zIndex: "0" }}>
        <img className="login-img" src="cover2.jpg" alt="Cover" />
        <div style={{ position: "relative", zIndex: "1" }} className="py-5 d-flex justify-content-center">
          <h1>{isLogin ? "تسجيل الدخول" : "انشاء حساب جديد"}</h1>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {isLoading && <div className="loading-spinner">Loading...</div>} {/* Loading spinner */}
        <div className="login-form px-4 py-1">
          <div>
            <Login
              name={name}
              setName={setName}
              isLogin={isLogin}
              email={email}
              setEmail={setEmail}
              setPassword={setPassword}
              password={password}
              handleEmailAuth={handleEmailAuth}
            />
          </div>
          <hr className="mb-4 mt-4" />
          <button className="google-btn w-100" onClick={handleGoogleAuth} disabled={isLoading}>
            <FcGoogle className="ms-2 fs-4" /> جوجل
          </button>
          <div className="d-flex justify-content-center w-100 gap-4 mt-4">
            {!isLogin ? (
              <div className="d-flex align-items-center gap-2">
                <div>لدي حساب بالفعل؟</div>
                <button
                  style={{ background: "none", border: "none", color: "var(--main-color)" }}
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isLoading}
                >
                  تسجيل
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <div>ليس ليك حساب؟</div>
                <button
                  style={{ background: "none", border: "none", color: "var(--main-color)" }}
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isLoading}
                >
                  انشاء حساب
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

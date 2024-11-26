"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail, loginWithEmail, signInWithGoogle } from "../../utility/auth";
import { db } from "../firebase/clientApp"; // Firebase and Firestore
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import Login from "@/Components/Login/Login";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For capturing name during sign-up
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter(); // Initialize useRouter

  // Function to create or update the Firestore document for a user
  async function createUserDoc(user) {
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

  // Validate form before proceeding with authentication
  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    if (!isLogin && !name) {
      setError("Name is required for sign-up");
      return false;
    }
    return true;
  };

  // Handle email-based authentication
  const handleEmailAuth = async () => {
    if (!validateForm()) return; // Ensure form is valid before proceeding

    setIsLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await loginWithEmail(email, password);
        console.log("Logged in user:", user);
      } else {
        user = await signUpWithEmail(email, password);
        const userWithName = { ...user, name };
        await createUserDoc(userWithName);
        console.log("Signed up user:", userWithName);
      }

      // Retrieve and store the auth token
      const token = await user.getIdToken(); // Firebase method to get ID token
      Cookies.set("authToken", token, { expires: 365 }); // Cookie expires in 1 year

      // Redirect to Matches page after success
      router.push("/Matches");
    } catch (err) {
      console.error("Authentication Error:", err);
      setError("Authentication failed. Please try again.");
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google authentication
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      console.time("Google Sign-in");
      const user = await signInWithGoogle();
      console.timeEnd("Google Sign-in");

      // Retrieve and store the auth token
      const token = await user.getIdToken();
      Cookies.set("authToken", token, { expires: 365 }); // Cookie expires in 1 year

      // Redirect immediately
      router.push("/Matches");

      // Run Firestore document creation in the background
      const userWithName = {
        ...user,
        name: user.displayName || user.email || "Unknown",
      };
      createUserDoc(userWithName); // No need to await
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Google sign-in failed. Please try again.");
      toast.error("Google sign-in failed. Please try again.");
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

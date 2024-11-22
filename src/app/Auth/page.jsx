"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { signUpWithEmail, loginWithEmail, signInWithGoogle } from "../../utility/auth";
import { db } from "../firebase/clientApp"; // Import Firebase and Firestore
import { doc, setDoc } from "firebase/firestore"; // For Firestore document operations
import { FcGoogle } from "react-icons/fc";
import Login from "@/Components/Login/Login";

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
    <>
      <div className="d-flex" style={{height: '100vh'}}>
        <div className="login-container m-md-auto w-100" style={{maxWidth: "600px", position: 'relative', zIndex: '0'}}>
          <img className="login-img" src="cover2.jpg"></img>
          <div style={{position: 'relative', zIndex: '1'}} className="py-5 d-flex justify-content-center">
            <h1>{isLogin ? "تسجيل الدخول" : "انشاء حساب جديد"}</h1>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="login-form px-4 py-1">
            <div>
              <Login name={name} setName={setName} isLogin={isLogin} email={email} setEmail={setEmail} setPassword={setPassword} password={password} handleEmailAuth={handleEmailAuth}/>
            </div>
            <hr className="mb-4 mt-4" />
            <button className="google-btn w-100" onClick={handleGoogleAuth}>
              <FcGoogle className="ms-2 fs-4" /> جوجل 
            </button>
            <div className="d-flex justify-content-center w-100 gap-4 mt-4">
                {!isLogin ? 
                  <div className="d-flex align-items-center gap-2">
                      <div>لدي حساب بالفعل؟</div>
                      <button style={{ background: "none", border: "none" , color: 'var(--main-color)'}} onClick={() => setIsLogin(!isLogin)}>
                          تسجيل
                      </button>
                  </div>
                  
                :
                <div className="d-flex align-items-center gap-2">
                  <div>ليس ليك حساب؟</div>
                  <button  style={{ background: "none", border: "none", color: 'var(--main-color)' }} onClick={() => setIsLogin(!isLogin)}>
                    انشاء حساب
                  </button>
                </div>
                }
                
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { 
  useState, 
  useCallback, 
  useEffect 
} from "react";
import { useRouter } from "next/navigation";
import { 
  signUpWithEmail, 
  loginWithEmail, 
  signInWithGoogle 
} from "@/utility/auth";
import { db } from "../firebase/clientApp";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import Login from "@/Components/Login/Login";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const ERROR_MESSAGES = {
  EMPTY_FIELDS: "Email, password, and name are required",
  AUTH_FAILED: "Authentication failed. Please try again.",
  GOOGLE_FAILED: "Google sign-in failed. Please try again."
};

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const createUserDoc = useCallback(async (user) => {
    try {
      const userRef = doc(db, "players", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          name: user.displayName || user.name || "Unknown",
          uid: user.uid,
          email: user.email,
          profilePhoto: user.photoURL,
          createdAt: new Date(),
          games: []
        }, { merge: true });
      }
    } catch (error) {
      console.error("User document creation failed", error);
      toast.error("Profile setup failed");
    }
  }, []);

  const validateForm = useCallback(() => {
    if (!email || !password || (!isLogin && !name)) {
      setError(ERROR_MESSAGES.EMPTY_FIELDS);
      return false;
    }
    return true;
  }, [email, password, name, isLogin]);

  const handleEmailAuth = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await loginWithEmail(email, password);
      } else {
        user = await signUpWithEmail(email, password);
        const userWithName = { ...user, name };
        await createUserDoc(userWithName);
      }

      const token = await user.getIdToken();
      Cookies.set("authToken", token, { 
        expires: 365, 
        secure: process.env.NODE_ENV === 'production' 
      });

      router.prefetch("/Matches");
      router.push("/Matches");

    } catch (err) {
      console.error("Authentication Error:", err);
      setError(ERROR_MESSAGES.AUTH_FAILED);
      toast.error(ERROR_MESSAGES.AUTH_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, name, isLogin, createUserDoc, router]);

  const handleGoogleAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      await createUserDoc(user);

      const token = await user.getIdToken();
      Cookies.set("authToken", token, { 
        expires: 365, 
        secure: process.env.NODE_ENV === 'production' 
      });

      router.prefetch("/Matches");
      router.push("/Matches");

    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(ERROR_MESSAGES.GOOGLE_FAILED);
      toast.error(ERROR_MESSAGES.GOOGLE_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [createUserDoc, router]);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div className="login-container m-md-auto w-100" style={{ maxWidth: "600px", position: "relative", zIndex: "0" }}>
        <img className="login-img" src="cover2.jpg" alt="Cover" />
        <div style={{ position: "relative", zIndex: "1" }} className="py-5 d-flex justify-content-center">
          <h1>{isLogin ? "تسجيل الدخول" : "انشاء حساب جديد"}</h1>
        </div>
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        {isLoading && <div className="loading-spinner">Loading...</div>}
        
        <div className="login-form px-4 py-1">
          <Login
            name={name}
            setName={setName}
            isLogin={isLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleEmailAuth={handleEmailAuth}
          />
          
          <hr className="mb-4 mt-4" />
          
          <button 
            className="google-btn w-100" 
            onClick={handleGoogleAuth} 
            disabled={isLoading}
          >
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
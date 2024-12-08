"use client"

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp" // Import the useRouter hook
import EditPlayerProfile from "@/Components/EditPlayerProfile/EditPlayerProfile";
import SignInAd from "@/Components/SignInAd/SignInAd";


export default function SettingsPage() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if(!user && !loading){
        return (
            <div className="d-flex justify-content-center align-items-center p-3" style={{height: '100vh'}}>
                <SignInAd/>
            </div>
        );
    }
    return(
        <>
            <div>
                <EditPlayerProfile playerId={user.uid}/>
            </div>
        </>
    )
}
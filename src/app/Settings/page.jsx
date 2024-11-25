"use client"

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp" // Import the useRouter hook
import EditPlayerProfile from "@/Components/EditPlayerProfile/EditPlayerProfile";


export default function SettingsPage() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }
    return(
        <>
            <div>
                <EditPlayerProfile playerId={user.uid}/>
            </div>
        </>
    )
}
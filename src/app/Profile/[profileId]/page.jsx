"use client"


import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import PlayerProfileInfo from "@/Components/PlayerProfileInfo/PlayerProfileInfo";
import PlayerStats from "@/Components/PlayerStats/PlayerStats";
import { useParams } from "next/navigation"; // Use next/navigation for routing
import MatchesViewer from "@/Components/MatchesViewer/MatchesViewer";
import PlayerMatchesViewer from "@/Components/PlayerMatchesViewer/PlayerMatchesViewer";
import TriggerApiInBackground from "@/Components/triggerServerClosingVotesCheck";
import CoinsDisplay from "@/Components/Coins/CoinsDisplay";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp" // Import the useRouter hook
import SignInAd from "@/Components/SignInAd/SignInAd";
import Link from "next/link";


export default function ProfilePage() {
    const params = useParams(); // Access the matchId from the URL params
    const { profileId } = params;
    const playerRef = doc(db, "players", profileId);
    const [playerData, playerLoading, playerError] = useDocument(playerRef);
    const [user, loading, error] = useAuthState(auth);

    const player = playerData?.data();


    if (playerLoading || loading) {
        return <div></div>;
    }
    
    if (playerError || error) {
        return <div>Error: {error.message}</div>;
    }
    
    if(!user && !loading && profileId == 1){
        return (
            <div className="d-flex justify-content-center align-items-center p-3" style={{height: '100vh'}}>
                <SignInAd/>
            </div>
        );
    }
    return(
        <div className="profile-page-container">
            <TriggerApiInBackground/>
            
            {/* Hero section with background and profile info */}
            <div className="profile-hero-section">
                {profileId == user?.uid && <div className="coins-display-wrapper mb-4 px-3"><Link href={'/Transaction/Withdraw'}><CoinsDisplay/></Link></div>}
                <div className="row m-0 align-items-center">
                    <div className="container py-2 col-12 col-lg-6">
                        <PlayerProfileInfo 
                            playerId={player?.uid} 
                            name={player?.name} 
                            photo={player?.profilePhoto} 
                            rate={(player?.ratesSum/ player?.ratesCount).toFixed(2)} 
                            ratesCount={player?.ratesCount}
                        />
                    </div>
                    <div className="stats-card px-3 col-12 col-lg-6">
                        <PlayerStats games={player?.games} playerId={player.uid}/>
                    </div>
                </div>
            </div>

            {/* Stats and matches section */}
            <div className="container profile-content py-4 px-0">
                <div className="matches-card p-0">
                    <PlayerMatchesViewer gamesIds={player?.games}/>
                </div>
            </div>
        </div>
    )
}
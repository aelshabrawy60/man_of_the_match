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


export default function ProfilePage() {
    const params = useParams(); // Access the matchId from the URL params
    const { profileId } = params;
    const playerRef = doc(db, "players", profileId);
    const [playerData, playerLoading, playerError] = useDocument(playerRef);
    const player = playerData?.data();


    if (playerLoading) {
        return <div></div>;
    }
    
    if (playerError) {
        return <div>Error: {error.message}</div>;
    }
    return(
        <>
            <div>
                <TriggerApiInBackground/>
                <div className="px-3">
                    <div className="my-4">
                        <PlayerProfileInfo playerId={player?.uid} name={player?.name} photo={player?.profilePhoto} rate={(player?.ratesSum/ player?.ratesCount).toFixed(2)} ratesCount={player?.ratesCount}/>
                    </div>
                    <div className="my-4">
                        <PlayerStats games={player?.games} playerId={player.uid}/>
                    </div>
                </div>
                <div>
                    <PlayerMatchesViewer gamesIds={player?.games}/>
                </div>
            </div>
        </>
    )
}
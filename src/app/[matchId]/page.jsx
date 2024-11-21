"use client";

import { useParams } from "next/navigation"; // Use next/navigation for routing
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp"; // Your Firestore instance
import PlayerRateCard from "@/Components/PlayerRateCard/PlayerRateCard";
import convertTo12HourFormat from '../../utility/convertTo24'
import { SlClock } from "react-icons/sl";
import { CiCalendarDate } from "react-icons/ci";
import { GiSoccerField } from "react-icons/gi";
import { MdOutlineStadium } from "react-icons/md";



export default function MatchPage() {
  const params = useParams(); // Access the matchId from the URL params
  const { matchId } = params; // Extract matchId from URL

  // Firestore reference to the specific game document
  const gameRef = doc(db, "games", matchId);

  // Fetch the document data using react-firebase-hooks
  const [gameDoc, loading, error] = useDocument(gameRef);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (gameDoc) {
    const gameData = gameDoc.data(); // Get the data from the document
    return (
      <div className="d-flex flex-column align-items-center">
        <h2 className="mb-5 mt-5">تفاصيل المبارة</h2>
        <div className="d-flex flex-column gap-3 align-items-center">
          <div className="d-flex fs-5 align-items-center"><CiCalendarDate className="ms-2 fs-4"/> {gameData?.day}</div>
          <div className="d-flex fs-5 align-items-center"><SlClock className="ms-2"/> {convertTo12HourFormat(gameData?.time)}</div>
          <div className="d-flex fs-5 align-items-center"><MdOutlineStadium className="ms-2 fs-4"/>  {gameData?.location}</div>
        </div>
        <p className="fs-3 mb-5 mt-5">اللاعبين</p>
          <ol className="d-flex pe-2 flex-column p-0 player-list gap-4">
            {gameData?.players?.map((player, index) => (
              <li key={index} className="pe-3"><PlayerRateCard playerId={player.uid} matchId={matchId}/></li> // You can modify this based on the player data
            ))}
          </ol>
      </div>
    );
  }

  return <div>No match found</div>;
}

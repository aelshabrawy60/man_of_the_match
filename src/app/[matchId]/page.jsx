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
import { GiSoccerKick } from "react-icons/gi";
import EditMatch from "@/Components/EditMatch/EditMatch";
import { MdEdit } from "react-icons/md";
import { MdClose } from "react-icons/md";
import PlayerRateCardsViewer from "@/Components/PlayersRateCardsViewer/PlayerRateCardsViewer";





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
        <div className='header w-100 text-center py-4'>
        <h2 className='m-0'>
        تفاصيل المباراة</h2>
        </div>
        <div className="d-flex w-100 justify-content-center align-items-center" style={{position: 'relative', height: '260px'}}>
          <img src="field.svg" className="field"></img>
          <div className="d-flex flex-column align-items-center gap-3" style={{position: 'relative', zIndex: '99'}}>
            <div className="d-flex fs-5 align-items-center"><CiCalendarDate className="ms-2 fs-4"/> {gameData?.day}</div>
            <div className="d-flex fs-5 align-items-center"><SlClock className="ms-2"/> {convertTo12HourFormat(gameData?.time)}</div>
            <div className="d-flex fs-5 align-items-center"><MdOutlineStadium className="ms-2 fs-4"/>  {gameData?.location}</div>
          </div>
        </div>
        <PlayerRateCardsViewer matchId={matchId}/>
          <button type="button" className="p-3 add-match-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              <MdEdit />
          </button>
          <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                    <div className="modal-header mb-2 d-flex justify-content-between">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">اضافة مباراة</h1>
                        <button type="button" className="close-button fs-4" data-bs-dismiss="modal" aria-label="Close"><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <EditMatch gameId={matchId}/>
                    </div>
                    </div>
                </div>
          </div>
      </div>
    );
  }

  return <div>No match found</div>;
}

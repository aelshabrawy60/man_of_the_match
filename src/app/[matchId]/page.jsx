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
import { getFullDate, getTime } from "@/app/functions/dateF";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase/clientApp";
import Warning from "@/Components/Warning/Warning";
import Cookies from 'js-cookie';
import SignInAd from "@/Components/SignInAd/SignInAd";
import Share from "@/Components/Share/Share";




export default function MatchPage() {
  const params = useParams(); // Access the matchId from the URL params
  const { matchId } = params; // Extract matchId from URL
  const [user, loading_, error_] = useAuthState(auth);

  const authToken = Cookies.get("authToken");
  const authenticated = !!authToken;
  // Firestore reference to the specific game document
  const gameRef = doc(db, "games", matchId);

  // Fetch the document data using react-firebase-hooks
  const [gameDoc, loading, error] = useDocument(gameRef);

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  

  if (gameDoc) {
    const gameData = gameDoc.data(); // Get the data from the document
    return (
      <div className="d-flex flex-column align-items-center">
        <div className='w-100 d-flex m-0 justify-content-between align-items-center p-3'>
          <h3 className='m-0'>
          تفاصيل المباراة
          </h3>
          <Share link={window.location.href}/> 
        </div>
        <div className="d-flex flex-column w-100 justify-content-center align-items-center gap-5" style={{position: 'relative', height: '260px'}}>
          <img src="field.jpg" className="field"></img>
          <div className="d-flex align-items-center gap-5" style={{position: 'relative', zIndex: '99'}}>
            <div className="d-flex fs-5 align-items-center"><CiCalendarDate className="ms-2 fs-4"/> {getFullDate(gameData?.date)}</div>
            <div className="d-flex fs-5 align-items-center"><MdOutlineStadium className="ms-2 fs-4"/>  {gameData?.location}</div>
          </div>
          <div>
            <div className="d-flex fs-3 align-items-center"><SlClock className="ms-2"/> {convertTo12HourFormat(getTime(gameData?.date))}</div>
          </div>
        </div>
        {!authenticated ? 
          <div className="p-2">
              <SignInAd title="هل انت مشارك في هذه المباراة" message="سجل الدخول لكي تسطيع تقييم اللاعبين"/>
          </div>
          :
          null
        }
        <PlayerRateCardsViewer matchId={matchId}/>
          {
            authenticated && gameData.creator == user.uid ?
            <>
            <button type="button" className="p-3 add-match-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              <MdEdit />
            </button>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog m-0 modal-dialog-scrollable">
                <div className="modal-content h-100">
                <div className="modal-header mb-2 d-flex justify-content-between">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">تعديل المباراة</h1>
                    <button type="button" className="close-button fs-4" data-bs-dismiss="modal" aria-label="Close"><MdClose /></button>
                </div>
                <div className="modal-body">
                    <EditMatch gameId={matchId}/>
                </div>
                </div>
            </div>
            </div>
            </> 
            :
            null
          }
          
          
      </div>
    );
  }

  return <div>No match found</div>;
}

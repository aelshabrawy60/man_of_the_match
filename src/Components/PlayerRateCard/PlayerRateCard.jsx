"use client";

import React, { useState,useEffect, useRef } from "react";
import "./PlayerRateCard.css";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp";

import RateInputCard from "../RateInputCard/RateInputCard";
import { FaStar } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import ProfilePhoto from "../ProfilePhoto/ProfilePhoto";
import RatePlayingStyle from "../RatePlayingStyle/RatePlayingStyle";


function PlayerRateCard({ playerId, matchId , rate, ratesCount_, type = 0, rateEnabeld, user}) {

  const rateDocId = `${playerId}_${matchId}`; // Unique document ID
  const rateRef = doc(db, "rates", rateDocId);
  const [rateData] = useDocument(rateRef);
  const [currentRate, setCurrentRate] = useState(rate);
  const [ratesCount, setRatesCount] = useState(ratesCount_);
  const [userRatedThisPlayer, setUserRatedThisPlayer] = useState(false);
  // Player reference and fetching data using `useDocument`
  const playerRef = doc(db, "players", playerId);
  const [playerData, playerLoading, playerError] = useDocument(playerRef);

  useEffect(() => {
    // Check if the user has already rated this player in this match
    if (rateData?.exists()) {
      const existingRates = rateData.data()?.values || [];
      const hasRated = existingRates.some(rate => rate.senderId === user?.uid);
      setUserRatedThisPlayer(hasRated);
    } else {
      setUserRatedThisPlayer(false);
    }
  }, [rateData, user?.uid]);

  // Update local state when rateData is fetched
  useEffect(() => {
    if (rateData?.exists()) {
      const data = rateData.data();
      const totalRates = data.values?.reduce((acc, rate) => acc + rate.value, 0) || 0;
      setCurrentRate(totalRates / data.values.length || 0); // Calculate average rate
      setRatesCount(data.values.length || 0);
    } else {
      setCurrentRate(0);
      setRatesCount(0);
    }
  }, [rateData]);

  // Add a new rate
  async function addRate(senderId, rateValue) {
    try {
      if (rateData?.exists()) {
        // Check if the user has already rated this player in this match
        const existingRates = rateData.data()?.values || [];
        const hasRated = existingRates.some(rate => rate.senderId === senderId);
  
        if (hasRated) {
          alert("You have already rated this player in this match.");
          return;
        }
  
        // If not rated, update the values array with the new rate
        await updateDoc(rateRef, {
          values: arrayUnion({
            senderId,
            value: rateValue,
          }),
        });
      } else {
        // Create a new rate document if it doesn't exist
        await setDoc(rateRef, {
          gameId: matchId,
          receiverId: playerId,
          values: [
            {
              senderId,
              value: rateValue,
            },
          ],
        });
      }
  
      console.log("Rate added successfully");
    } catch (error) {
      console.error("Error adding rate:", error);
    }
  }
  

  const modalTriggerRef = React.useRef(null);

  function giveRate(rate){
      if (modalTriggerRef.current) {
          modalTriggerRef.current.click();
      }
      addRate(user.uid, parseInt(rate))
  }
  if (playerLoading) {
    return <div>Loading player data...</div>;
  }

  if (playerError) {
    return <div>Error fetching player data: {playerError.message}</div>;
  }

  const player = playerData?.data();


  return (

      <>
        <div className="player-rate-card d-flex gap-3 w-100 align-items-center justify-content-between">
          <Link href={`Profile/${playerId}`}>
            <div className="d-flex gap-3 align-items-center" style={{maxWidth: '220px'}}>
              <ProfilePhoto img={player?.profilePhoto || "default-image.png"} size={60} badge={player.uid == 'tqvz2WOgOBMdnAHfmF4Tf392hwR2' ? '/star-badge.png' : null}/>
              <div>
                <div className={type == 1 ? 'fs-5': ''}>{player?.name || "Player Name"}</div>
                {type == 1 ? null
                :
                <div className="d-flex gap-1">
                  <div className="d-flex align-items-center gap-1"> <FaStar className="star"/> {currentRate.toFixed(2)}</div>
                  <div>({ratesCount})</div>
                </div>
                }
                
              </div>
            </div>
          </Link>
          {type == 0 ? 

            
            <div className="me-2">
              {/*player can not rate himself */}
              {rateEnabeld ? (
                  user.uid !== playerId ? (
                      <button
                          type="button"
                          className="main-btn rate-btn"
                          data-bs-toggle="modal"
                          data-bs-target={"#staticBackdrop" + player?.uid}
                          disabled={userRatedThisPlayer}
                      >
                          تقييم
                      </button>
                  ) : (
                      <div>انت</div>
                  )
              ) : null}
              
              
              <div className="modal fade" id={"staticBackdrop" + player?.uid}  data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-scrollable">
                      <div className="modal-content">
                      <div className="modal-header mb-2 d-flex justify-content-between">
                          <h1 className="modal-title fs-5" id="staticBackdropLabel">قم بتقييم <span>{player?.name}</span></h1>
                          <button type="button" className="close-button fs-4" data-bs-dismiss="modal" aria-label="Close"><MdClose /></button>
                      </div>
                      <div className="modal-body">
                          <RateInputCard giveRate={giveRate}/>
                      </div>
                      </div>
                  </div>
              </div>
            </div>
          
          : 
            
            <div className="me-3">
              <div className="rate-container d-flex align-items-center"><span className="fs-5 ms-2">{currentRate.toFixed(1)}</span><FaStar className="star fs-5"/></div>
            </div>
          }
          
        </div>

        <div className="modal fade p-0" id={"staticBackdrop" + player?.uid + "2"}  data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <button
            ref={modalTriggerRef}
            type="button"
            className="d-none"
            data-bs-toggle="modal"
            data-bs-target={"#staticBackdrop" + player?.uid + "2"}
          />
          <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                  <div className="modal-header mb-2 d-flex justify-content-between">
                      <h1 className="modal-title fs-5" id="staticBackdropLabel">قم بتقييم <span>{player?.name}</span></h1>
                      <button type="button" className="close-button fs-4" data-bs-dismiss="modal" aria-label="Close"><MdClose /></button>
                  </div>
                  <div className="modal-body">
                    <RatePlayingStyle matchId={matchId} reciverId={playerId} senderId={user?.uid}/>
                  </div>
                  </div>
              </div>
          </div>
      </>
    
  );
}

export default PlayerRateCard;

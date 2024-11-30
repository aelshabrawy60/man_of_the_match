import React from 'react'

import './RatePlayingStyle.css'
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, setDoc, updateDoc, getDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp";
import { PLAYING_STYLES } from "../PlayStyleCard/PlayingStyles"
import PlayerStyleCard from '../PlayStyleCard/PlayerStyleCard';


function RatePlayingStyle({matchId, reciverId, senderId}) {
  const rateDocId = `${reciverId}_${matchId}`; // Unique document ID
  const rateRef = doc(db, "playingStyelsRates", rateDocId);
  const [rateData] = useDocument(rateRef);
  const playingStyles = PLAYING_STYLES.map(style => style.id)


    async function updateRatesInPlayer(receiverId, playingStyleName) {
    const playerRef = doc(db, "players", receiverId);

    // Get the current document data
    const docSnapshot = await getDoc(playerRef);

    if (docSnapshot.exists()) {
        const playerData = docSnapshot.data();

        // Ensure the playingStyleVotes field exists and initialize if not
        if (!playerData.playingStyleVotes) {
        await updateDoc(playerRef, {
            playingStyleVotes: {} // Initialize playingStyleVotes as an empty object
        });
        }

        // Ensure the specific playingStyleName exists within playingStyleVotes and initialize if not
        const fieldPath = `playingStyleVotes.${playingStyleName}`;
        const currentVotes = playerData.playingStyleVotes[playingStyleName];

        // If the field does not exist, initialize it to 0
        if (currentVotes === undefined) {
        await updateDoc(playerRef, {
            [fieldPath]: 0 // Initialize the vote count to 0
        });
        }

        // Increment the specific playingStyle vote by 1
        await updateDoc(playerRef, {
        [fieldPath]: increment(1) // Increment by 1
        });

        console.log(`${playingStyleName} vote incremented by 1!`);
    } else {
        console.log("Player document does not exist!");
    }
    }


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

        updateRatesInPlayer(reciverId, playingStyles[rateValue])
      } else {
        // Create a new rate document if it doesn't exist
        await setDoc(rateRef, {
          gameId: matchId,
          receiverId: reciverId,
          values: [
            {
              senderId,
              value: rateValue,
            },
          ],
        });
        updateRatesInPlayer(reciverId, playingStyles[rateValue])
      }
      console.log("Rate added successfully");
    } catch (error) {
      console.error("Error adding rate:", error);
    }
  }

  return (
    <div>
        <div className='mb-3'>اختر اسلوب اللعب المناسب</div>
        <div className="row m-0 row-gap-2">
          {playingStyles.map((playStyle, i)=> <button data-bs-dismiss="modal" aria-label="Close" className='col-6 col-md-4 p-1' key={playStyle} style={{border: 'none', background: 'none'}} onClick={()=> addRate(senderId, i)}><PlayerStyleCard Identfier={playStyle}/></button>)}
        </div>
    </div>
  )
}

export default RatePlayingStyle
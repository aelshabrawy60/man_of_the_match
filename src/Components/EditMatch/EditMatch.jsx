"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../app/firebase/clientApp"; 
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Add updateDoc here
import { IoAddSharp } from "react-icons/io5";
import PlayerDropdown from "../PlayersDropdown/PlayerDropdown";
import PlayerCard from "../PlayerCard/PlayerCard";
import './EditMatch.css';

function EditMatch({ gameId }) {
  const [players, setPlayers] = useState([]);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isEditable, setIsEditable] = useState(true); // Flag to track if match can still be edited

  // Fetch match data based on gameId
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const matchDoc = doc(db, "games", gameId);
        const matchSnap = await getDoc(matchDoc);
        if (matchSnap.exists()) {
          const matchData = matchSnap.data();
          const temp = await Promise.all(
            matchData.players.map(async (player) => {
              const playerDetails = await fetchPlayerDetails(player.uid); // Fetch player details
              return {
                uid: player.uid,
                name: playerDetails.name,         // Assuming fetchPlayerDetails returns `name`
                profilePhoto: playerDetails.profilePhoto // Assuming fetchPlayerDetails returns `profilePhoto`
              };
            })
          );
          setPlayers(temp || []);
          setDay(matchData.day);
          setTime(matchData.time);
          setLocation(matchData.location);

          // Check if the match time has passed
          const matchDate = new Date(`${matchData.day}T${matchData.time}`);
          const currentTime = new Date();
          if (currentTime > matchDate) {
            setIsEditable(false); // Disable editing if the match has started
          }
        } else {
          console.error("Match not found!");
        }
      } catch (error) {
        console.error("Error fetching match data: ", error);
      }
    };

    if (gameId) {
      fetchMatchData();
    }
  }, [gameId]);

  // Function to update the match
  const updateMatch = async () => {
    try {
      if (!isEditable) {
        console.log("Match cannot be edited after it starts.");
        const matchDoc = doc(db, "games", gameId);
        await updateDoc(matchDoc, {
          players: players.map(player => ({ uid: player.uid })), // Store players as an array of maps with uid
        });
        return;
      }

      // Ensure the date and time are valid
      if (!day || !time || !location) {
        console.error("All fields must be filled in!");
        return;
      }

      // Update match data in Firestore
      const matchDoc = doc(db, "games", gameId);
      await updateDoc(matchDoc, {
        day: day,
        time: time,
        location: location,
        players: players.map(player => ({ uid: player.uid })), // Store players as an array of maps with uid
      });

      console.log("Match updated successfully!");
    } catch (error) {
      console.error("Error updating match: ", error);
    }
  };

  // Function to fetch player name and photo based on UID
  const fetchPlayerDetails = async (uid) => {
    const playerDocRef = doc(db, "players", uid);
    const playerDocSnap = await getDoc(playerDocRef);
    if (playerDocSnap.exists()) {
      const playerData = playerDocSnap.data();
      return { name: playerData.name, profilePhoto: playerData.profilePhoto };
    }
    return null;
  };

  // Function to add a player
  // Function to add a player
  const addPlayer = (uid, name, profilePhoto) => {
    const playerExists = players.some((player) => player.uid === uid);
    if (!playerExists) {
      setPlayers([...players, { uid, name, profilePhoto }]); // Update players as an array of objects with uid
    }
  };

  // Function to remove a player
  const removePlayer = (uid) => {
    setPlayers(players.filter((player) => player.uid !== uid));
  };

  return (
    <div className="edit-match-container">
      <div className="row m-0 row-gap-3 mb-4">
        <div className="d-flex flex-column col-6 gap-2">
          <label>اليوم</label>
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={!isEditable} // Disable editing if not editable
          />
        </div>
        <div className="d-flex flex-column col-6 gap-2">
          <label>الساعة</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!isEditable} // Disable editing if not editable
          />
        </div>
        <div className="d-flex flex-column w-100 gap-2">
          <label>الملعب</label>
          <input
            type="text"
            placeholder="اسم الملعب"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={!isEditable} // Disable editing if not editable
          />
        </div>
      </div>

      <div className="players p-2">
        <div className="fs-5 mb-3">اللاعبين</div>
        
        {players.map((player) => (
          <PlayerCard key={player.uid} name={player.name} photo={player.profilePhoto} onRemove={() => removePlayer(player.uid)}/>
        ))}
        <div>
          <div className="dropdown mt-4">
            <button
              className="fs-4 d-flex justify-content-center align-items-center main-btn stroke-btn w-100"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled={false} // Disable the button if match is not editable
            >
              <IoAddSharp />
            </button>
            <div className="dropdown-menu p-0 w-100">
              <PlayerDropdown isCliked={addPlayer} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          className="main-btn w-100 fs-5"
          onClick={updateMatch}
          data-bs-dismiss="modal"
          aria-label="Close"
          disabled={false} // Disable the button if match is not editable
        >
          حفظ
        </button>
      </div>
    </div>
  );
}

export default EditMatch;

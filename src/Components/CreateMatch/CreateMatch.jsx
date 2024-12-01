"use client";

import { useState } from "react";
import { db } from "../../app/firebase/clientApp"; // Import your Firestore instance
import { collection, addDoc , Timestamp} from "firebase/firestore"; // For adding data to Firestore
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs
import PlayerDropdown from "../PlayersDropdown/PlayerDropdown";
import PlayerCard from "../PlayerCard/PlayerCard";
import { IoAddSharp } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase/clientApp";
import './CreateMatch.css'
import EditMatch from "../EditMatch/EditMatch";
import closeVotes from "@/app/functions/closeVotes";

function CreateMatch() {
  const [user, loading_, error_] = useAuthState(auth);
  const [players, setPlayers] = useState([]);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [location, setLocation] = useState(""); // To store the match location

  // Function to add a player to the match
  function addPlayer(uid, name, profilePhoto) {
    const playerExists = players.some((player) => player[0] === uid);

    if (playerExists) {
      console.log("Player already added");
      return;
    }

    const player = [uid, name, profilePhoto];
    setPlayers([...players, player]);
    console.log(players);
  }

  function convertToFirebaseTimestamp(dateString, timeString) {
    const dateTimeString = `${dateString}T${timeString}:00`; // Combine date and time into one string
    const jsDate = new Date(dateTimeString); // Convert to a JavaScript Date object
    return Timestamp.fromDate(jsDate); // Convert to Firebase Timestamp
  }

  function calcEndDate(dateString, timeString){
    const dateTimeString = `${dateString}T${timeString}:00`; // Combine date and time into one string
    const jsDate = new Date(dateTimeString);
    jsDate.setHours(jsDate.getHours() + 5) 
    return Timestamp.fromDate(jsDate)
  }
  // Function to save match data to Firebase Firestore
  const saveMatch = async () => {
    try {

      // Ensure the date is not empty
      if (!day || day.trim() === "") {
        console.error("Date is empty or not properly formatted. Please select a valid date.");
        return;
      }

      // Store the match data with the unique ID
      const matchData = {
        creator: user.uid,
        date: convertToFirebaseTimestamp(day, time),
        endDate: calcEndDate(day, time),
        closedVotes: false, // Store the date as a string from the input
        location: location,
        players: players.map((player) => ({
          uid: player[0], // Only store the UID for each player
        })),
      };

      // Check if matchData contains any undefined values
      for (const key in matchData) {
        if (matchData[key] === undefined || matchData[key] === null) {
          console.log(`Error: ${key} is undefined or null`);
          return;
        }
      }

      // Add to Firestore
      await addDoc(collection(db, "games"), matchData);

      console.log("Match saved successfully");
    } catch (error) {
      console.error("Error saving match: ", error);
    }
  };

  // Function to remove a player
  const removePlayer = (uid) => {
    setPlayers(players.filter((player) => player[0] !== uid));
    console.log(uid);
  };

  return (
    <div className="create-match-container pt-4">
      <div className="row m-0 row-gap-3 mb-4">
        <div className="d-flex flex-column col-6 gap-2">
          <label className="create-match-label">اليوم</label>
          <div className="position-relative">
            <input
              type="date"
              value={day}
              onChange={(e) => {
                setDay(e.target.value); 
                console.log("Date selected in input field:", e.target.value); 
              }}
              className="create-match-input"
              id="date-input"
            />
            <IoCalendarOutline 
              className="position-absolute end-0 top-50 translate-middle-y input-icon" 
              onClick={() => document.getElementById('date-input').showPicker()}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
        <div className="d-flex flex-column col-6 gap-2">
          <label className="create-match-label">الساعة</label>
          <div className="position-relative">
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value); 
                console.log("Date selected in input field:", e.target.value); 
              }}
              className="create-match-input"
              id="time-input"
            />
            <IoTimeOutline 
              className="position-absolute end-0 top-50 translate-middle-y input-icon" 
              onClick={() => document.getElementById('time-input').showPicker()}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
        <div className="d-flex flex-column w-100 gap-2">
          <label className="create-match-label">الملعب</label>
          <input
            type="text"
            placeholder="اسم الملعب"
            value={location}
            onChange={(e) => setLocation(e.target.value)} 
            className="create-match-input"
          />
        </div>
      </div>
      <div className="players-section p-3">
        <div className="players-title">اللاعبين</div>
        <div className="players-list">
          {players.map((player) => (
            <PlayerCard key={player[0]} name={player[1]} photo={player[2]} onRemove={() => removePlayer(player[0])} />
          ))}
        </div>
        <div>
          <div className="dropdown mt-4">
            <button 
              className="add-player-btn d-flex justify-content-center align-items-center" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <IoAddSharp className="fs-4" />
            </button>
            <div className="dropdown-menu p-0 w-100">
              <PlayerDropdown isCliked={addPlayer}/>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-3">
        <button 
          className="main-btn w-100 save-match-btn gradient-btn" 
          onClick={saveMatch} 
          data-bs-dismiss="modal" 
          aria-label="Close"
        >
          حفظ المباراة
        </button>
      </div>
    </div>
  );
}

export default CreateMatch;

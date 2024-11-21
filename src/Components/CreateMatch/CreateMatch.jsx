"use client";

import { useState } from "react";
import { db } from "../../app/firebase/clientApp"; // Import your Firestore instance
import { collection, addDoc } from "firebase/firestore"; // For adding data to Firestore
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs
import PlayerDropdown from "../PlayersDropdown/PlayerDropdown";
import PlayerCard from "../PlayerCard/PlayerCard";
import { IoAddSharp } from "react-icons/io5";

import './CreateMatch.css'

function CreateMatch() {
  const [players, setPlayers] = useState([]);
  const [date, setDate] = useState("");
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

  // Function to save match data to Firebase Firestore
  const saveMatch = async () => {
    try {

      // Ensure the date is not empty
      if (!day || day.trim() === "") {
        console.error("Date is empty or not properly formatted. Please select a valid date.");
        return;
      }

      // Generate a unique ID for the match
      const matchId = uuidv4();

      // Store the match data with the unique ID
      const matchData = {
        id: matchId, // Add the unique match ID
        day: String(day),
        time: String(time), // Store the date as a string from the input
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

  return (
    <div className="creat-match-container">
      <div className="row m-0 row-gap-3 mb-4">
        <div className="d-flex flex-column col-6 gap-2">
          <label>اليوم</label>
          <input
            type="date"
            value={day}
            onChange={(e) => {
              setDay(e.target.value); // Store the date directly as a string
              console.log("Date selected in input field:", e.target.value); // Log date immediately on change
            }}
          />
        </div>
        <div className="d-flex flex-column col-6 gap-2">
          <label>الساعة</label>
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value); // Store the date directly as a string
              console.log("Date selected in input field:", e.target.value); // Log date immediately on change
            }}
          />
        </div>
        <div className="d-flex flex-column w-100 gap-2">
          <label>الملعب</label>
          <input
            type="text"
            placeholder="اسم الملعب"
            value={location}
            onChange={(e) => setLocation(e.target.value)} // Update the location state
          />
        </div>
      </div>
      <div className="players p-2">
        <div className="fs-5 mb-3">اللاعبين</div>
        {players.map((player) => (
          <PlayerCard key={player[0]} name={player[1]} photo={player[2]} />
        ))}
        <div>
          <div className="dropdown mt-4">
            <button className="fs-4 d-flex justify-content-center align-items-center main-btn stroke-btn w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <IoAddSharp />
            </button>
            <div className="dropdown-menu p-0 w-100">
              <PlayerDropdown isCliked={addPlayer}/>
            </div>
          </div>
      </div>
      </div>
      
      <div className="mt-5">
        <button className="main-btn w-100 fs-5" onClick={saveMatch} data-bs-dismiss="modal" aria-label="Close">حفظ</button>
      </div>
    </div>
  );
}

export default CreateMatch;

import React, { useEffect, useState } from 'react';
import { IoFootball } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp"; // Adjust the path as needed
import './PlayerStats.css';

function PlayerStats({ games, playerId }) {
  const [manOfTheMatchGames, setManOfTheMatchGames] = useState([]);

  useEffect(() => {
    const fetchManOfTheMatchGames = async () => {
      const fetchedGames = [];
      
      // Create a query to fetch only games where manOfTheMatch equals the playerId
      const gamesRef = collection(db, "games");
      const q = query(gamesRef, where("manOfTheMatch", "==", playerId));

      try {
        const querySnapshot = await getDocs(q);

        // Process the query results
        querySnapshot.forEach((doc) => {
          const gameData = doc.data();
          if (games.includes(doc.id)) {
            fetchedGames.push(gameData);
          }
        });

        setManOfTheMatchGames(fetchedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchManOfTheMatchGames();
  }, [games, playerId]);

  return (
    <div className='d-flex player-stats-container justify-content-around gradient-btn p-2'>
        <div>
            <div className='mb-2'>المشاركات</div>
            <div className='d-flex fs-3 justify-content-center gap-2 align-items-center'>
                <IoFootball className='fs-2'/><div>{games?.length}</div>
            </div>
        </div>
        
        <div className='text-center'>
            <div className='mb-2'>رجل المباراة</div>
            <div className='d-flex fs-3 gap-2 justify-content-center align-items-center'>
                <FaMedal />
                <div>{manOfTheMatchGames.length}</div> {/* Display the number of man of the match games */}
            </div>
        </div>
    </div>
  );
}

export default PlayerStats;

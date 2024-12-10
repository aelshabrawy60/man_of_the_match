import { useEffect, useState } from 'react';
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
    <div className='player-stats-container'>
      <div className='stat-box'>
        <div className='stat-label'>المشاركات</div>
        <div className='stat-value'>
          <div className='stat-icon'>
            <IoFootball />
          </div>
          <div>{games?.length}</div>
        </div>
      </div>
      
      <div className='stat-box'>
        <div className='stat-label'>رجل المباراة</div>
        <div className='stat-value'>
          <div className='stat-icon'>
            <FaMedal />
          </div>
          <div>{manOfTheMatchGames.length}</div>
        </div>
      </div>
    </div>
  );
}

export default PlayerStats;

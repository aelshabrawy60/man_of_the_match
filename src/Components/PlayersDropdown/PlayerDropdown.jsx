import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../app/firebase/clientApp';  // Import your Firestore instance
import { collection } from 'firebase/firestore';
import PlayerCard from '../PlayerCard/PlayerCard';
import './PlayersDropdown.css'

function PlayerDropdown({isCliked}) {
  // Create a state variable to track the search query
  const [searchQuery, setSearchQuery] = useState("");

  const playersCollectionRef = collection(db, 'players');

  // Fetch the players from Firestore using the useCollection hook
  const [players, loading, error] = useCollection(playersCollectionRef);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Filter players based on the search query (case-insensitive)
  const filteredPlayers = players.docs.filter(doc => {
    const playerData = doc.data();
    const playerName = playerData?.name;  // Use optional chaining to prevent undefined errors

    // Only filter if the name exists and matches the search query
    return playerName && playerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className='players-dropdown-container'>
      <div className='search-box mb-3'>
        <input
          className='w-100'
          type="text"
          placeholder="ابحث"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className='players-dropdown_body'>
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(doc => {
            const playerData = doc.data();  // Get the data from each document
            return (
              <div key={doc.id} onClick={() => isCliked(playerData.uid, playerData.name, playerData.profilePhoto)}>
                <PlayerCard name={playerData.name} photo={playerData.profilePhoto}/>
              </div>
            );
          })
        ) : (
          <p>No players found</p>
        )}
      </div>
    </div>
  );
}

export default PlayerDropdown;

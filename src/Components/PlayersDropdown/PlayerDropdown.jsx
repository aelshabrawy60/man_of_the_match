import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../app/firebase/clientApp';
import { collection } from 'firebase/firestore';
import PlayerCard from '../PlayerCard/PlayerCard';
import './PlayersDropdown.css';
import { FaSearch, FaExclamationCircle } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

  /**
   * Renders a dropdown list of players based on the Firestore collection
   * The list is filtered based on the search query
   * When a player is clicked, the isCliked callback is called with the player's uid, name, and profile photo
   */

  
function PlayerDropdown({isCliked}) {
  const [searchQuery, setSearchQuery] = useState("");
  const playersCollectionRef = collection(db, 'players');
  const [players, loading, error] = useCollection(playersCollectionRef);

  if (loading) {
    return (
      <div className="players-dropdown-container loading-state">
        <ImSpinner8 className="loading-spinner" />
        <p>جاري التحميل...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="players-dropdown-container error-state">
        <FaExclamationCircle className="error-icon" />
        <p>عذراً، حدث خطأ ما</p>
        <small>{error.message}</small>
      </div>
    );
  }

  const filteredPlayers = players?.docs.filter(doc => {
    const playerData = doc.data();
    const playerName = playerData?.name;
    return playerName && playerName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className='players-dropdown-container'>
      <div className='search-box'>
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="ابحث عن لاعب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className='players-dropdown_body'>
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(doc => {
            const playerData = doc.data();
            return (
              <div 
                key={doc.id} 
                className="player-item"
                onClick={() => isCliked(playerData.uid, playerData.name, playerData.profilePhoto)}
              >
                <PlayerCard name={playerData.name} photo={playerData.profilePhoto}/>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>لم يتم العثور على لاعبين</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerDropdown;

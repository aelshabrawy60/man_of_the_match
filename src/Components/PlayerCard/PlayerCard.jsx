import React from 'react'

import './PlayerCard.css'

function PlayerCard({photo, name}) {
  return (
    <div className='player-card-container p-4 d-flex gap-4 align-items-center'>
        <div className='player-profile-photo-container'>
            <img src={photo}></img>
        </div>
        <div>{name}</div>
    </div>
  )
}

export default PlayerCard
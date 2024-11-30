import React from 'react'
import { PLAYING_STYLES } from './PlayingStyles'
import './PlayerStyleCard.css'


function PlayerStyleCard({Identfier}) {

  const playerStyle = PLAYING_STYLES.find(style => style.id === Identfier)

  function generateGradientColor() {
    const color = playerStyle.color;
    // Create a lighter version by adding alpha transparency
    const lighterColor = color + '90'; // 80 is 50% transparency in hex
    return `linear-gradient(to right, ${color}, ${lighterColor})`;
  }

  return (
    <div className='player-style-card-container justify-content-center d-flex align-items-center px-3 py-2 gap-2' style={{background: generateGradientColor()}}>
        <div className='player-style-icon-container'>
            <img src={playerStyle.icon} alt="Player Style Icon" width="40" height="40" style={{filter: 'brightness(0) invert(1)'}}/>
        </div>
        <div className='player-style-name'>{playerStyle.name}</div>
    </div>
  )
}

export default PlayerStyleCard
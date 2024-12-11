import { FaStar } from "react-icons/fa6";

import './PlayerProfileInfo.css'
import ProfilePhoto from "../ProfilePhoto/ProfilePhoto";
function PlayerProfileInfo({name, rate, ratesCount, photo, playerId}) {
    
  return (
    <div className='player-profile-container'>
        <div className='profile-content-wrapper d-flex flex-column flex-xl-row'>
            <div className='profile-photo-wrapper'>
                <ProfilePhoto 
                    img={photo} 
                    size={120} 
                    badge={playerId == 'tqvz2WOgOBMdnAHfmF4Tf392hwR2' ? '/star-badge.png' : null}
                />
            </div>
            <div className='player-info text-center'>
                <h3 className='player-name mb-3'>{name}</h3>
                <div className="rating-container">
                    <div className="rating-stars">
                        <FaStar className="star-icon"/>
                        <span className="rating-value">{rate}</span>
                    </div>
                    <span className="rating-count">({ratesCount} تقييمات)</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PlayerProfileInfo
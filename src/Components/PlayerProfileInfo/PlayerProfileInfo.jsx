
import { FaStar } from "react-icons/fa6";

import './PlayerProfileInfo.css'
import ProfilePhoto from "../ProfilePhoto/ProfilePhoto";
function PlayerProfileInfo({name, rate, ratesCount, photo, playerId}) {
    
  return (
    <div className='d-flex align-items-center gap-3'>
        <ProfilePhoto img={photo} size={130} badge={playerId == 'tqvz2WOgOBMdnAHfmF4Tf392hwR2' ? '/star-badge.png' : null}/>
        <div className='player-info'>
            <div className='fs-3 mb-2'>
                {name}
            </div>
            <div className="d-flex align-items-center">
                <span className="fs-3 ms-1"><FaStar className="star"/></span>
                <span className="fs-2 fw-bold ms-2">{rate}</span>
                <span className="fs-6">({ratesCount})</span>
            </div>
        </div>
    </div>
  )
}

export default PlayerProfileInfo
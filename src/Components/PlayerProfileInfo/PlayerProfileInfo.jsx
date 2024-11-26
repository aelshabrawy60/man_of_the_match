
import { FaStar } from "react-icons/fa6";

import './PlayerProfileInfo.css'
function PlayerProfileInfo({name, rate, ratesCount, photo}) {
    
  return (
    <div className='d-flex align-items-center gap-3'>
        <div className='profile-photo-container'>
            <img src={photo}></img>
        </div>
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
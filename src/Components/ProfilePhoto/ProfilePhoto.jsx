import React from 'react'

function ProfilePhoto({img, size = 55, badge = null}) {
  return (
    <div className='profile-photo-container'>
        <img src={img} height={size} width={size}></img>
        {badge != null ? 
            <div className='badge'>
                <img src={badge} width={size/10} height={size/10}></img>
            </div>
        :
        null
        }
        
    </div>
  )
}

export default ProfilePhoto
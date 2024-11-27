import React from 'react';
import './ProfilePhoto.css';

function ProfilePhoto({ img, size = 55, badge = null }) {

  function calcBadgePosition(size) {
    // Calculate position to always be in the bottom right corner
    // Offset by 10% of the image size to create a slight inset
    const verticalOffset = size * 0.1 ;
    const horizontalOffset = size * 0.24;
    
    return {
      position: 'absolute',
      bottom: `${verticalOffset}px`,
      right: `${horizontalOffset}px`,
      transform: 'translate(50%, 50%)',
    };
  }

  const badgeSize = Math.max(size / 3, 25);

  return (
    <div className="profile-photo-container_">
      <img
        className="profile-photo-container__img"
        src={img}
        height={size}
        width={size}
        alt="Profile"
      />
      {badge && (
        <div className="badge" style={calcBadgePosition(size, badgeSize)}>
          <img src={badge} width={badgeSize} height={badgeSize} alt="Badge" />
        </div>
      )}
    </div>
  );
}

export default ProfilePhoto;

import React from 'react'

function MatchTimer({matchDate}) {

    function calculateTimeRemaining() {
        const now = new Date();
        const createdAt = matchDate.toDate();
        const diffInSeconds = Math.floor((createdAt - now) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            if (diffInDays === 2) return `بعد يومين`;
            if (diffInDays > 10) return `بعد ${diffInDays} يوم`;
            return `بعد ${diffInDays === 1 ? 'يوم' : diffInDays + ' أيام'}`;
        } else if (diffInHours > 0) {
            if (diffInHours === 2) return `بعد ساعتين`;
            if (diffInHours > 10) return `بعد ${diffInHours} ساعة`;
            return `بعد ${diffInHours === 1 ? 'ساعة' : diffInHours + ' ساعات'}`;
        } else if (diffInMinutes > 0) {
            if (diffInMinutes === 2) return `منذ دقيقتين`;
            if (diffInMinutes > 10) return `بعد ${diffInMinutes} دقيقة`;
            return `بعد ${diffInMinutes === 1 ? 'دقيقة' : diffInMinutes + ' دقائق'}`;
        } else {
            return `بعد ثوان`;
        }
   }
  return (
    <div className="man-of-the-match-card__label d-flex align-items-center">
            تبداء  {calculateTimeRemaining()}
    </div>
  )
}

export default MatchTimer
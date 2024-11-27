import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate }) => {
  // Function to calculate remaining time
  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const difference = endDate - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 }; // Timer reached zero
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  // Initialize state to store remaining time
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    console.log(endDate)
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [endDate]);

  return (
    <div>
      {timeLeft.hours >= 0 && timeLeft.minutes >= 0 && timeLeft.seconds >= 0 ? (
        <div>
          <span>{timeLeft.hours.toString().padStart(2, '0')}:</span>
          <span>{timeLeft.minutes.toString().padStart(2, '0')}:</span>
          <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
        </div>
      ) : (
        <div>Time's up!</div>
      )}
    </div>
  );
};

export default CountdownTimer;

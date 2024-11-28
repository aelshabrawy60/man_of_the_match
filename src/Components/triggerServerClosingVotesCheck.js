'use client';

import { useEffect } from 'react';

const TriggerApiInBackground = () => {

  // Function to call the API endpoint asynchronously in the background
  const callApiInBackground = async () => {
    try {
      // Call the API without waiting for the response
      fetch('http://localhost:3000/api/CheckAndCloseVotesPlayerMatches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally send a request body if needed
        // body: JSON.stringify(data),
      });

      console.log('API call triggered in the background');
    } catch (error) {
      console.error('Error triggering API:', error);
    }
  };

  // Call the API when the component mounts or based on a user action
  useEffect(() => {
    // Trigger the API call when the component is mounted
    callApiInBackground();
  }, []); // Empty dependency array means this runs once when the component is mounted

  return (
    null
  );
};

export default TriggerApiInBackground;

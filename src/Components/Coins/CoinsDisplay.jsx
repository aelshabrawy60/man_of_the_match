'use client';

import { useState, useEffect } from 'react';
import styles from './CoinsDisplay.module.css';
import { FaCoins } from 'react-icons/fa';
import { auth } from '../../app/firebase/clientApp';
import Cookies from 'js-cookie'; // Ensure this is the correct library

const CoinsDisplay = () => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to refresh the token
  const refreshIdToken = async () => {
    const user = auth.currentUser;

    if (user) {
      const idToken = await user.getIdToken(true); // Force refresh of the token
      console.log("refreshed token:", idToken);
      Cookies.set('authToken', idToken, {
        expires: 365, // Ensure it lasts for a year
        path: '/',
        sameSite: 'lax',
        secure: window.location.protocol === 'https:', // Secure cookie on HTTPS
      });
      // Update the last refresh time in localStorage
      localStorage.setItem('lastTokenRefresh', Date.now().toString());
    }
  };

  useEffect(() => {
    // Get the last token refresh time from localStorage
    const lastTokenRefresh = localStorage.getItem('lastTokenRefresh');
    const currentTime = Date.now();

    // If no refresh time is found, or it's been more than 55 minutes since the last refresh
    if (!lastTokenRefresh || currentTime - Number(lastTokenRefresh) > 55 * 60 * 1000) {
      refreshIdToken(); // Refresh the token immediately
    }

    // Set interval for token refresh (every 55 minutes)
    const intervalId = setInterval(refreshIdToken, 55 * 60 * 1000);

    // Cleanup function when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures it runs only once on mount

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('/api/coins');
        if (!response.ok) {
          throw new Error('Failed to fetch coins');
        }
        const data = await response.json();
        setCoins(data.coins);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []); // Only fetch coins once on mount

  const handleAddCoins = async () => {
    try {
      const response = await fetch('/api/coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 100 }),
      });

      if (!response.ok) {
        throw new Error('Failed to add coins');
      }

      setCoins(prevCoins => prevCoins + 100);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={`${styles.coinsCard} ${styles.skeleton}`}>
          <div className={styles.mainContent}>
            <div className={`${styles.iconWrapper} ${styles.skeletonPulse}`} />
            <div className={styles.coinsInfo}>
              <div className={`${styles.label} ${styles.skeletonPulse}`} />
              <div className={`${styles.coinAmount} ${styles.skeletonPulse}`} />
            </div>
          </div>
          <div className={`${styles.pointsLabel} ${styles.skeletonPulse}`} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error loading coins: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.coinsCard}>
        <div className={styles.mainContent}>
          <div className={styles.iconWrapper}>
            <FaCoins className={styles.coinIcon} />
          </div>
          <div className={styles.coinsInfo}>
            <div className={styles.label}>رصيدك</div>
            <div className={styles.coinAmount}>{coins}</div>
          </div>
        </div>
        <div className={styles.pointsLabel}>نقطة</div>
      </div>
    </div>
  );
};

export default CoinsDisplay;

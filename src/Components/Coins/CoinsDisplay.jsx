'use client';

import { useState, useEffect } from 'react';
import styles from './CoinsDisplay.module.css';
import { FaCoins } from 'react-icons/fa';

const CoinsDisplay = () => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

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
              <div className={`${styles.label} ${styles.skeletonPulse}`}/>
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

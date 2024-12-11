import React from 'react';
import Link from 'next/link';
import styles from './PrizeAd.module.css';

const PrizeAd = () => {
  return (
    <div className={styles.adContainer}>
      <div className={styles.prizeInfo}>
        <div className={styles.prizeAmount}>
          <span className={styles.amount}>2000</span>
          <span className={styles.currency}>جنيه</span>
        </div>
        <div className={styles.prizeText}>جائزة لاعب الشهر</div>
      </div>
      <Link href="/Prize_rules" className={styles.rulesButton}>
        التفاصيل والشروط
      </Link>
    </div>
  );
};

export default PrizeAd;

"use client"

import React, { useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../app/firebase/clientApp';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../app/firebase/clientApp';
import MatchCard from '../MatchCard/MatchCard';
import { GiSoccerBall } from "react-icons/gi";
import './MatchesViewer.css';

function MatchesViewer() {
  const [user] = useAuthState(auth);
  const [filterType, setFilterType] = useState('mine'); // 'all', 'mine', 'created'

  // Create a query based on filter
  const gamesQuery = (() => {
    // If user is not authenticated and filter requires auth, default to 'all'
    if (!user && (filterType === 'mine' || filterType === 'created')) {
      return query(
        collection(db, 'games'),
        orderBy('date', 'desc')
      );
    }

    switch(filterType) {
      case 'mine':
        return query(
          collection(db, 'games'),
          where('players', 'array-contains', { uid: user.uid }),
          orderBy('date', 'desc')
        );
      case 'created':
        return query(
          collection(db, 'games'),
          where('creator', '==', user.uid),
          orderBy('date', 'desc')
        );
      default: // 'all'
        return query(
          collection(db, 'games'),
          orderBy('date', 'desc')
        );
    }
  })();

  // Use the query with useCollection
  const [matches, loading, error] = useCollection(gamesQuery);

  if (loading) {
    return <div className='d-flex justify-content-center align-items-center w-100' style={{height: '100vh'}}><div className="loader"></div></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='matches-viewer-container d-flex flex-column'>
      <div className='header w-100 text-center py-3'>
        <h2 className='m-0'>المباريات</h2>
      </div>
      
      <div className='filter-container mt-3 mb-3'>
        <button 
          className={`filter-btn ${filterType === 'mine' ? 'active' : ''}`} 
          onClick={() => setFilterType('mine')}
        >
          مشاركاتي
        </button>
        <button 
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`} 
          onClick={() => setFilterType('all')}
        >
          الكل
        </button>
        <button 
          className={`filter-btn ${filterType === 'created' ? 'active' : ''}`} 
          onClick={() => setFilterType('created')}
        >
          إنشائي
        </button>
      </div>

      <div className='row m-0 gap-3'>
        {matches && matches.docs.length > 0 ? (
          matches.docs.map(doc => {
            const matchData = doc.data();
            return (
              <div key={doc.id} className='col-12'>
                <MatchCard 
                  date={matchData.date} 
                  id={doc.id} 
                  MOTM={matchData?.manOfTheMatch} 
                  location={matchData.location}
                />
              </div>
            );
          })
        ) : (
          <p>لا توجد مباريات</p>
        )}
      </div>
    </div>
  );
}

export default MatchesViewer
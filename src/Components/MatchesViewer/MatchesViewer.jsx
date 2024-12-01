"use client"

import React, { useMemo, useState } from 'react'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import {db} from '../../app/firebase/clientApp';
import { collection, query, orderBy, where } from 'firebase/firestore';
import MatchCard from '../MatchCard/MatchCard';
import { GiSoccerBall } from "react-icons/gi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase/clientApp";
import './MatchesViewer.css'

function MatchesViewer() {
  const [user, userLoading, userError] = useAuthState(auth);
  const [filterType, setFilterType] = useState('all');
  
  // Create queries based on filter type
  const baseQuery = useMemo(() => 
    query(collection(db, 'games'), orderBy('date', 'desc')),
    []
  );
  
  const myGamesQuery = useMemo(() => 
    user ? query(
      collection(db, 'games'),
      where('players', 'array-contains', user.uid),
      orderBy('date', 'desc')
    ) : null,
    [user]
  );

  // Use the appropriate query based on filter type
  const [matches, loading, error] = useCollection(
    filterType === 'all' ? baseQuery : myGamesQuery
  );

  if (error || userError) {
    return <div>Error: {error?.message || userError?.message}</div>;
  }

  return (
    <div className='matches-viewer-container d-flex flex-column align-items-center'>
      <div className='header w-100 text-center py-3 mb-1'>
        <h2 className='m-0'>المباريات</h2>
      </div>
      
      {/* Filter buttons */}
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
      </div>

      <div className='row m-0 gap-3'>
        {loading ? (
          // Show 3 skeleton cards while loading
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="col-12">
              <div className="match-card-skeleton">
                <div className="skeleton-header">
                  <div className="skeleton-location"></div>
                  <div className="skeleton-date"></div>
                  <div className="skeleton-time"></div>
                </div>
                <div className="skeleton-body">
                  <div className="skeleton-label"></div>
                  <div className="skeleton-player"></div>
                </div>
              </div>
            </div>
          ))
        ) : matches?.docs?.length > 0 ? (
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
          <p className='mt-5'>لا توجد مباريات</p>
        )}
      </div>
    </div>
  );
}

export default MatchesViewer
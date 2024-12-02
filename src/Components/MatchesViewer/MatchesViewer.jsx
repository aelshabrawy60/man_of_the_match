"use client"

import React, { useMemo, useState, useEffect } from 'react'
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
  const [filterType, setFilterType] = useState('mine');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevMatches, setPrevMatches] = useState(null);
  
  // Create queries based on filter type
  const baseQuery = useMemo(() => 
    query(collection(db, 'games'), orderBy('date', 'desc')),
    []
  );
  
  const myGamesQuery = useMemo(() => {
    if (!user || userLoading) return null;
    
    return query(
      collection(db, 'games'),
      where('players', 'array-contains', { uid: user.uid }),
      orderBy('date', 'desc')
    );
  }, [user, userLoading]);

  // Use the appropriate query based on filter type
  const [matches, loading, error] = useCollection(
    filterType === 'all' ? baseQuery : (myGamesQuery || baseQuery)
  );

  // Store previous matches while transitioning
  useEffect(() => {
    if (!loading && matches) {
      setPrevMatches(matches);
    }
  }, [matches, loading]);

  // Handle filter changes with transition state
  const handleFilterChange = (newFilter) => {
    if (newFilter === filterType) return;
    setIsTransitioning(true);
    setFilterType(newFilter);
    // Use a longer transition for a smoother effect
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Show loading state if:
  // 1. Initial user loading
  // 2. Query is loading without previous matches
  // 3. Filter transition without previous matches
  const isLoading = (loading && !prevMatches) || userLoading || (filterType === 'mine' && !user);

  if (error || userError) {
    return <div>Error: {error?.message || userError?.message}</div>;
  }

  const displayMatches = isTransitioning ? prevMatches : matches;

  return (
    <div className='matches-viewer-container d-flex flex-column align-items-center'>
      <div className='header w-100 text-center py-3 mb-1'>
        <h2 className='m-0'>المباريات</h2>
      </div>
      
      {/* Filter buttons */}
      <div className='filter-container mt-3 mb-3'>
        <button 
          className={`filter-btn ${filterType === 'mine' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('mine')}
          disabled={!user}
        >
          مشاركاتي
        </button>
        <button 
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('all')}
        >
          الكل
        </button>
      </div>

      <div className='row m-0 w-100 gap-3'>
        {isLoading ? (
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
        ) : displayMatches?.docs?.length > 0 ? (
          displayMatches.docs.map(doc => {
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
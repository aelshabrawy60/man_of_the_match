"use client"

import React from 'react'


import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../app/firebase/clientApp';  // Import your Firestore instance
import { collection } from 'firebase/firestore'; 
import MatchCard from '../MatchCard/MatchCard';
import { GiSoccerBall } from "react-icons/gi";




function MatchesViewer() {
  // Create a reference to the "players" collection
  const gamesCollectionRef = collection(db, 'games');

  // Use the `useCollection` hook to get all documents from the collection
  const [matches, loading, error] = useCollection(gamesCollectionRef);

  if (loading) {
    return <div className='d-flex justify-content-center align-items-center w-100' style={{height: '100vh'}}><div className="loader"></div></div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='matches-viewer-container d-flex flex-column align-items-center'>
      <div className='header w-100 text-center py-3 mb-4'>
        <h2 className='m-0'> <GiSoccerBall className='ms-3 fs-1 header-icon'/>
        المباريات </h2>
      </div>
      <div className='row m-0 gap-3'>
        {matches && matches.docs.length > 0 ? (
          matches.docs.map(doc => {
            const matchData = doc.data();  // Get the data from each document
            return (
              <div key={doc.id} className='col-12'>
                  <MatchCard time={String(matchData.time)} day={String(matchData.day)} id={doc.id} MOTM={matchData?.manOfTheMatch} location={matchData.location}/>
              </div>
            );
          })
        ) : (
          <p>لا توجد مباريات</p>
        )}
      </div>
    </div>
  )
}

export default MatchesViewer
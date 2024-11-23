"use client"
import React, { useEffect } from 'react'
import './PlayerCard.css'
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp";

function PlayerCard({ uid , photo, name}) {


  return (
    <div className='player-card-container p-4 d-flex gap-4 align-items-center'>
      <div className='player-profile-photo-container'>
        <img
          src={photo} 
          alt="Player Profile"
        />
      </div>
      <div>{name}</div>
    </div>
  );
}

export default PlayerCard;

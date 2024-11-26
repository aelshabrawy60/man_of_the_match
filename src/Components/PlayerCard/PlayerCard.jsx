"use client"
import React, { useEffect } from 'react'
import './PlayerCard.css'
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp";
import { IoClose } from "react-icons/io5";

function PlayerCard({ uid , photo, name, onRemove = null}) {


  return (
    <div className='player-card-container p-4 d-flex justify-content-between align-items-center'>
      <div className='d-flex gap-4 align-items-center'>
        <div className='player-profile-photo-container'>
          <img
            src={photo} 
            alt="Player Profile"
          />
        </div>
        <div style={{maxWidth: onRemove == null ? 'unset':'130px'}}>{name}</div>
      </div>
      {onRemove != null ?
        <div>
        <button className='btn btn-danger' onClick={onRemove}>
          <IoClose />
        </button>
        </div> 
      : null}
      
    </div>
  );
}

export default PlayerCard;

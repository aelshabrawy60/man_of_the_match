"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import convertTo12HourFormat from '../../utility/convertTo24'

import './MatchCard.css'

function MatchCard({day, time , players, location, id}) {
  const [day_, setDay] = useState(day)
  const [time_ , setTime] = useState(time)

  useEffect(()=>{
      setTime(convertTo12HourFormat(time_))
  }, [])

  
  return (
    <Link href={`/${id}`}>
      <div className='match-card-container'>
        <div className='p-4 d-flex py-5 justify-content-center align-items-center gap-4'>
            <div className='fs-5'>{location}</div>
            <div className='mx-4 match-date'>{day_}</div>
            <div className='fs-5'>{time_}</div>
        </div>
        <div className='man-of-the-match-card d-flex justify-content-center'>
            <div className='man-of-the-match-card__label'>رجل المباراة</div>
            <div className='mt-4 mb-3'>
                لم يتم التحديد بعد
            </div>
        </div>
      </div>
    </Link>
  )
}

export default MatchCard
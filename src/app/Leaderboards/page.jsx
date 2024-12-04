"use client"
import MotmLeaderboard from '@/Components/MotmLeaderboard/MotmLeaderboard'
import PrizeAd from '@/Components/PrizeAd/PrizeAd'
import React from 'react'

function leaderboards() {
  return (
    <div>
        <div className='p-2'>
            <PrizeAd/>
            <MotmLeaderboard/>
        </div>
    </div>
  )
}

export default leaderboards
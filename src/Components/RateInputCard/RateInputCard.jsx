import React from 'react'

import './RateInputCard.css'

function RateInputCard({giveRate}) {
    const rates = [{value: '3', color : '#a82d2d'}, {value: '4', color : '#a84a2d'}, {value: '5', color : '#a86d2d'}, {value: '6', color : '#a8942d'}, {value: '7', color : '#8ea82d'}, {value: '8', color : '#6ba82d'}, {value: '9', color : '#48a82d'}, {value: '10', color : '#48a82d'}]
  return (
    <div className='rate-input-card-container'>
        <div className='mb-3'>اختر تقييم</div>
        <div className='row m-0 row-gap-2'>
            {rates.map((rate, i)=> <div key={i} className='col-12 col-md-6 p-1'><button style={{backgroundColor: rate.color}} className='main-btn rate-num-btn w-100' key={i} onClick={() => giveRate(rates[i].value)} data-bs-dismiss="modal" aria-label="Close">{rate.value}</button></div>)}
        </div>
    </div>
  )
}

export default RateInputCard
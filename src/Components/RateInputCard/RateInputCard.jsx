import React, { useState } from 'react'

import './RateInputCard.css'

function RateInputCard({giveRate}) {
    const [hoveredRate, setHoveredRate] = useState(null);
    const rates = [
        {value: '2', color: '#d32f2f'},
        {value: '3', color: '#c63f2f'},
        {value: '4', color: '#b84f2f'},
        {value: '5', color: '#ab5f2f'},
        {value: '6', color: '#9e6f2f'},
        {value: '7', color: '#7a8c34'},
        {value: '8', color: '#558b2f'},
        {value: '9', color: '#2e7d32'},
        {value: '10', color: '#1b5e20'}
    ];

    return (
        <div className='rate-input-card-container'>
            <div className='rate-title'>اختر تقييم اللاعب</div>
            <div className='rate-description'>{hoveredRate ? `تقييم ${hoveredRate}/10` : 'حرك المؤشر على الرقم لمعرفة التقييم'}</div>
            <div className='rate-grid'>
                {rates.map((rate, i) => (
                    <button
                        key={i}
                        className='rate-btn-2'
                        style={{
                            '--btn-color': rate.color,
                            '--btn-hover-color': rate.color + 'dd'
                        }}
                        onClick={() => giveRate(rate.value)}
                        onMouseEnter={() => setHoveredRate(rate.value)}
                        onMouseLeave={() => setHoveredRate(null)}
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    >
                        {rate.value}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default RateInputCard
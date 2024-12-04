import React, { useEffect, useState } from 'react'
import '../../app/loading.css'
import PlayerCard from '../PlayerCard/PlayerCard';
import './MotmLeaderboard.css'
import Link from 'next/link';


function MotmLeaderboard() {
    const [players, setPlayers] = useState([]);
    const [choosedFilter, setChoosedFilter] = useState('month');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/MOTM_Leaderboard/?filter=' + choosedFilter)
        .then(res => res.json())
        .then(data => {
            setPlayers(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        });
    }, [choosedFilter])

    return (
        <div className='leaderboard-container'>
            <div className='header w-100 text-center py-3'>
                <h2 className='title-text mb-5'>
                    قائمة رجال المباريات
                </h2>
                <div className='filter-tabs '>
                    <button 
                        className={`filter-tab ${choosedFilter === 'week' ? 'active' : ''}`}
                        onClick={() => setChoosedFilter('week')}
                    >
                        اسبوعي
                    </button>
                    <button 
                        className={`filter-tab ${choosedFilter === 'month' ? 'active' : ''}`}
                        onClick={() => setChoosedFilter('month')}
                    >
                        شهري
                    </button>
                    <button 
                        className={`filter-tab ${choosedFilter === 'year' ? 'active' : ''}`}
                        onClick={() => setChoosedFilter('year')}
                    >
                        سنوي
                    </button>
                </div>
            </div>
            
            {isLoading ? (
                <div className='d-flex justify-content-center align-items-center w-100' style={{height: '200px'}}>
                    <div className="loader"></div>
                </div>
            ) : players && players.length > 0 ? (
                <div className="leaderboard-list">
                    {players.map((player, i) => (
                        <Link href={`/Profile/${player.playerId}`} key={i}>
                            <div className={`leaderboard-item ${i < 3 ? `top-${i + 1}` : ''}`}>
                                <div className="rank-badge">{i + 1}</div>
                                <PlayerCard uid={player.playerId} photo={player.profilePhoto} name={player.name} onRemove={null}/>
                                <div className="motm-count">
                                    <span className="count-number">{player.count}</span>
                                    <span className="count-label">مرة</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>لا يوجد لاعبين في هذه الفترة</p>
                </div>
            )}
        </div>
    )
}

export default MotmLeaderboard
import React from 'react'
import { doc , updateDoc} from 'firebase/firestore'
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from '../../app/firebase/clientApp';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import './Notification.css'
import Link from 'next/link';

function Notification({data, refuseRequest}) {
    const playerRef = doc(db, "players", data.sender);
    const [playerData, playerLoading, playerError] = useDocument(playerRef);
    const matchRef = doc(db, "games", data.matchId);
    const [matchData, matchLoading, matchError] = useDocument(matchRef);

    if (playerLoading || matchLoading) {
        return <div>loading</div>;
    }
    if (playerError || matchError) {
        return <div>Error loading data</div>;
    }

    async function acceptRequest(){
        const notificationRef = doc(db, 'notifications', `${data.sender}_${data.matchId}`); // Get reference to the notification document
        await updateDoc(notificationRef, {
            status: 'accepted'
        });

        fetch('/api/accept-join-match-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({matchId: data.matchId, playerId: data.sender}),
        });
    }

    // Calculate time ago
    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const createdAt = timestamp.toDate();
        const diffInSeconds = Math.floor((now - createdAt) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
    
        if (diffInDays > 0) {
            // Handle the special case for exactly 2 days
            if (diffInDays === 2) {
                return `منذ يومين`;
            }
            if(diffInDays > 10){
                return `منذ ${diffInDays} يوم`
            }
            // Handle singular and plural forms for days
            return `منذ ${diffInDays === 1 ? 'يوم' : diffInDays + ' أيام'}`;
        } else if (diffInHours > 0) {
            // Handle the special case for exactly 2 hours
            if (diffInHours === 2) {
                return `منذ ساعتين`;
            }
            if(diffInHours > 10){
                return `منذ ${diffInHours} ساعة`
            }
            // Handle singular form for exactly 1 hour, plural for other numbers
            return `منذ ${diffInHours === 1 ? 'ساعة' : diffInHours + ' ساعات'}`;
        } else if (diffInMinutes > 0) {
            // Handle the special case for exactly 2 minutes
            if (diffInMinutes === 2) {
                return `منذ دقيقتين`;
            }

            if(diffInMinutes > 10){
                return `منذ ${diffInMinutes} دقيقة`
            }
            // Handle singular and plural forms for minutes
            return `منذ ${diffInMinutes === 1 ? 'دقيقة' : diffInMinutes + ' دقائق'}`;
        } else {
            return `منذ ثوان`;
        }
    };
    

    const timeAgo = getTimeAgo(data.createdAt);

    if (data.type === "join-match") {
        const match = matchData?.data();
        const matchTime = match?.date
            ?.toDate()
            .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
            .replace("AM", "ص")
            .replace("PM", "م");

        return (
            <div className="d-flex gap-3 p-2 py-4 notification-container">
                <Link href={`/Profile/${data.sender}`}>
                    <ProfilePhoto 
                        img={playerData?.data()?.profilePhoto} 
                        size={90} 
                        badge={playerData?.data()?.uid == 'tqvz2WOgOBMdnAHfmF4Tf392hwR2' ? '/star-badge.png' : null}
                    />
                </Link>
                <div>
                    <div className='fw-bold mb-2 fs-5'>
                        {playerData?.data()?.name}
                    </div>
                    <div className='mb-1 join-match-description'>
                        قام بطلب الانضمام الي مباراة {match?.location} الساعة {matchTime}
                    </div>
                    <div className='mb-2 time-ago'>{timeAgo}</div> {/* Display the time ago */}
                    <div className='d-flex gap-2'>
                        <button className='w-100 main-btn gradient-btn' onClick={acceptRequest}>قبول</button>
                        <button className='w-100 main-btn cancel-btn' onClick={() => refuseRequest(`${data.sender}_${data.matchId}`)}>رفض</button>
                    </div>
                </div>
            </div>
        );
    }

    return <div />;
}

export default Notification;

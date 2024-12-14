import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { db } from '../../app/firebase/clientApp';
import { useDocument } from 'react-firebase-hooks/firestore';
import './JoinMatch.css';


function JoinMatch({ gameDoc, user, isUserInMatch, matchId }) {
  const requestRef = doc(db, "notifications", `${user.uid}_${matchId}`);
  const [requestData, loading, error] = useDocument(requestRef);
  const [sendRequestEnabled, setSendRequestEnabled] = useState(false);
  const [isJoinRequestSent, setIsJoinRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  async function sendJoinRequest() {

    if(requestData.exists() && requestData.data().status != "pending"){
        setIsJoinRequestSent(true)
        return null
    }

    if (!user) {
      return null;
    }

    try {
      setRequestLoading(true);
      const response = await fetch('/api/send_notfication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: user.uid,
          receiver: gameDoc.data().creator,
          type: 'join-match',
          message: "sad",
          matchId: matchId,
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);

    } catch (error) {
      console.error('Error:', error);
    }
    setRequestLoading(false);
  }

  async function cancelRequest() {
    if(requestData.exists() && requestData.data().status != "pending"){
        setIsJoinRequestSent(false)
        return null
    }
    if (!user) {
      return null;
    }

    try {
      setRequestLoading(true);
      const response = await fetch('/api/cancel_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: user.uid,
          matchId: matchId,
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);

    } catch (error) {
      console.error('Error:', error);
    }
    setRequestLoading(false);
  }

  useEffect(() => {
    if (loading || !gameDoc) return;

    if (!user) {
      return;
    }

    if (gameDoc) {
      if (
        gameDoc.data().date.toDate() > new Date() &&
        user.uid !== gameDoc.data().creator &&
        !isUserInMatch()
      ) {
        setSendRequestEnabled(true);
      }

      if (requestData?.exists()) {
        
            setIsJoinRequestSent(true);
      }else{
        setIsJoinRequestSent(false);
      }
    }
  }, [gameDoc, requestData]);

  if(requestLoading || loading){
    return(
        <button className="main-btn gradient-btn d-flex justify-content-center" style={{width: '130px', height: '42px'}}>
           <div className="loader" style={{width: '26px'}}></div>
        </button>
    )
  }

  return (
    <div>
      {sendRequestEnabled ? (
        <>
          {isJoinRequestSent ? (
            <button className="main-btn cancel-btn" onClick={cancelRequest} style={{width: '130px', height: '42px'}}>
              الغاء الطلب
            </button>
          ) : (
            <button className="main-btn gradient-btn" onClick={sendJoinRequest} style={{width: '130px', height: '42px'}}>
                طلب الانضمام
            </button>
          )}
        </>
      ) : null}
      
    </div>
  );
}

export default JoinMatch;

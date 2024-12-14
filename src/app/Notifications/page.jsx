"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../app/firebase/clientApp"; // Ensure firestore is correctly imported
import { collection, query, where, orderBy } from "firebase/firestore";
import Notification from "@/Components/Notification/Notification";
import { doc, updateDoc } from 'firebase/firestore'
import SignInAd from "@/Components/SignInAd/SignInAd";

function Page() {
  const [user, loading, error] = useAuthState(auth);

  // Fetch notifications
  const notificationsQuery = user
    ? query(
        collection(db, "notifications"),
        where("receiver", "==", user.uid),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      )
    : null;

  const [notifications, notificationsLoading, notificationsError] = useCollectionData(notificationsQuery, {
    idField: "id", // Include the document ID as a field
  });

  async function refuseRequest(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId); // Get reference to the notification document
      await updateDoc(notificationRef, {
        status: 'refused'
      });
    } catch (error) {
      console.error("Error updating notification: ", error);
    }
  }
  if (loading || notificationsLoading) return <div></div>;
  if (error || notificationsError) return <div>Error: {(error || notificationsError).message}</div>;

  if(!user && !loading){
    return (
        <div className="d-flex justify-content-center align-items-center p-3" style={{height: '100vh'}}>
            <SignInAd/>
        </div>
    );
  }
  return (
    <div className="p-4">
      <h1 className="mb-4">الاشعارات</h1>
      <ul className="p-0" style={{ listStyle: "none" }}>
        {notifications?.map((notification, i) => (
          <li key={i}><Notification data={notification} refuseRequest={refuseRequest}/></li> // Adjust to your notification structure
        ))}
      </ul>
    </div>
  );
}

export default Page;

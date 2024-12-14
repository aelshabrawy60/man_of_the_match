"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { db } from "../firebase/clientApp";

// Create Context
const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
    const [user, loading, error] = useAuthState(auth); // Track user authentication state
    const [unreadCount, setUnreadCount] = useState(0);

    // Only run the query when the user is loaded (authenticated)
    const [snapshots, unread_loading, unread_error] = useCollection(
        user ? query(collection(db, 'notifications'), where('read', '==', false), where('receiver', '==', user?.uid), where('status', '==', 'pending')) : null,
        { snapshotListenOptions: { includeMetadataChanges: true } }
    );

    useEffect(() => {
        if (snapshots) {
            setUnreadCount(snapshots.size); // Set the unread count
        }
    }, [snapshots]);

    return (
        <UserContext.Provider value={{ user, loading, error, unreadCount , unread_loading, unread_error}}>
            {children}
        </UserContext.Provider>
    );
};

// Hook to use UserContext
export const useUser = () => useContext(UserContext);

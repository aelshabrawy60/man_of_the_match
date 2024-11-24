"use client"

import { createContext, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";

// Create Context
const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook to use UserContext
export const useUser = () => useContext(UserContext);

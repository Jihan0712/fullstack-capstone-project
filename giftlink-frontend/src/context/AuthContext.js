import React, { createContext, useContext, useState } from 'react';

// Step 1: Create the AuthContext
const AuthContext = createContext();

// Step 2: Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Step 3: Custom hook to use the auth context
const useAppContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AuthProvider');
    }
    return context;
};

export { useAppContext };
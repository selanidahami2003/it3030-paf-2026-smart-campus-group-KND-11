import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // null = identity not set yet (will show identity form)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage if available
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Called when user fills in the identity form
    const identify = (name, studentId) => {
        const newUser = {
            id: "2",
            name: name,
            studentId: studentId,
            email: "user@smartcampus.edu",
            role: "USER"
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, identify, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

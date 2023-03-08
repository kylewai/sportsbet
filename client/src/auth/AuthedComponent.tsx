import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export const AuthedComponent = ({ children, onAuthCancelled }: { children: React.ReactNode, onAuthCancelled?: () => void }) => {
    const { isAuthenticated, setAuthRequest } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            setAuthRequest({ isAuthRequested: true, onAuthCancelled });
        }
    }, []);

    if (isAuthenticated) {
        return <>{children}</>;
    }
    else {
        return <></>
    }
}
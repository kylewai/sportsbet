import React, { useRef, useContext, useState, useEffect, ComponentType, FC } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

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
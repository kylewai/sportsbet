import * as React from 'react';
import { useState } from 'react';
import { To } from 'react-router-dom';
import { SignIn } from './SignIn';

interface IAuthContext {
    authRequest: IAuthRequest;
    isAuthenticated: boolean;
    setAuthRequest: (authRequest: IAuthRequest) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

interface IAuthRequest {
    isAuthRequested: boolean;
    onAuthCancelled?: () => void;
    previousRoute?: any;
}

export const AuthContext = React.createContext<IAuthContext>(
    {
        authRequest: { isAuthRequested: false },
        isAuthenticated: false,
        setAuthRequest: (authRequest: IAuthRequest) => { },
        setIsAuthenticated: (isAuthenticated: boolean) => { }
    }
);

export const AuthProvider = (props: any) => {
    const [authRequest, setAuthRequest] = useState<IAuthRequest>({ isAuthRequested: false });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    return (
        <AuthContext.Provider value={{ isAuthenticated: isAuthenticated, authRequest: authRequest, setAuthRequest: setAuthRequest, setIsAuthenticated: setIsAuthenticated }}>
            {props.children}
            <SignIn setIsAuthenticated={setIsAuthenticated} />
        </AuthContext.Provider>

    )
}
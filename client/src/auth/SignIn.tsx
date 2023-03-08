import { useRef, useContext, useState } from 'react';
import { AuthContext } from './AuthProvider';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { makePostReq, manageErrors } from '@utils/DataFetcher';
import { SIGN_IN_URL } from '@utils/serverEndpoints';

const authFormStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};

export const SignIn = () => {
    const { authRequest, setAuthRequest, setIsAuthenticated } = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState("");
    const usernameInputRef = useRef<HTMLInputElement>();
    const passwordInputRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    const onSignInClicked = async () => {
        const username = usernameInputRef.current?.value;
        const password = passwordInputRef.current?.value;
        if (!username || !password) {
            setErrMsg("Username and password must be filled out");
            return;
        }

        signIn(username, password)
            .then(() => {
                setIsAuthenticated(true);
                setAuthRequest({ isAuthRequested: false });
            })
            .catch((error: Error) => setErrMsg(error.message));
    }

    const onClose = () => {
        if (typeof authRequest.onAuthCancelled === "function") {
            authRequest.onAuthCancelled();
        }
        if (authRequest.previousRoute) {
            navigate(authRequest.previousRoute);
        }
        setAuthRequest({ isAuthRequested: false });
        setErrMsg("");
    }

    return (
        <Modal
            open={authRequest.isAuthRequested}
            onClose={onClose}
        >
            <Box sx={authFormStyle} component="form">

                <TextField inputRef={usernameInputRef}
                    fullWidth margin="dense"
                    label="Username"
                    variant="outlined" />

                <TextField inputRef={passwordInputRef}
                    fullWidth margin="dense"
                    label="Password"
                    type="password"
                    variant="outlined" />

                <p style={{ color: "red" }}>{errMsg}</p>

                <SignInActions onAuthenticate={onSignInClicked} onSignUp={() => setAuthRequest({ isAuthRequested: false })} />
            </Box>
        </Modal>
    )
}

interface ISignInActionsProps {
    onAuthenticate: () => void;
    onSignUp: () => void;
}

const SignInActions = ({ onAuthenticate, onSignUp }: ISignInActionsProps) => {
    return (
        <Stack direction="column" spacing={1} alignItems="center" sx={{ marginTop: 1 }}>
            <Button onClick={onAuthenticate} sx={{ width: 400 }} variant="contained" size="large">Sign in</Button>
            <Box sx={{ width: "100%" }}>
                <Link onClick={onSignUp} to="/signup">
                    <Typography sx={{ float: 'left' }}>Join now</Typography>
                </Link>
                <Link to="/">
                    <Typography sx={{ float: 'right' }}>Trouble logging in?</Typography>
                </Link>
            </Box>
        </Stack>
    );
}

const signIn = (username: string, password: string) => {
    return makePostReq(SIGN_IN_URL, { username, password });
}
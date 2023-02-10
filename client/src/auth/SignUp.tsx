import { useContext, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Stack } from "@mui/material";
import { manageErrors } from "../utils/DataFetcher";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const authFormStyle = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};

export const SignUp = () => {
    const usernameInputRef = useRef<HTMLInputElement>();
    const passwordInputRef = useRef<HTMLInputElement>();
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();
    const context = useContext(AuthContext);

    const register = async () => {
        const username = usernameInputRef.current?.value;
        const password = passwordInputRef.current?.value;
        if (!username || !password) {
            setErrMsg("Username and password must be filled out");
            return;
        }
        fetch("/api/users/register",
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        username: username,
                        password: password
                    }
                ),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => manageErrors(response))
            .then(() => {
                context.setIsAuthenticated(true);
                navigate("/");
            })
            .catch((error: Error) => setErrMsg(error.message));
    }

    return (
        <>
            <Box sx={authFormStyle}>
                <h2 style={{ display: "flex", justifyContent: "center" }}>KWSports</h2>
                <Stack>
                    <TextField inputRef={usernameInputRef} margin="dense" id="outlined-basic" label="Username" variant="outlined" />
                    <TextField inputRef={passwordInputRef} margin="dense" id="outlined-basic" label="Password" type="password" variant="outlined" />
                </Stack>
                <p style={{ color: "red" }}>{errMsg}</p>
                <Button onClick={register} sx={{ width: 400 }} variant="contained" size="large">Sign up</Button>
            </Box>
        </>
    )
}
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useRef, useState } from "react";
import { apiFetcher, manageErrors } from "../utils/DataFetcher";
import { NavigateFunction, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import useSWR, { useSWRConfig } from "swr";

interface IUserBalance {
    balance: number;
}
export const Account = () => {
    const { isAuthenticated, setAuthRequest, authRequest } = useContext(AuthContext);
    useEffect(() => {
        if (!isAuthenticated) {
            setAuthRequest({ isAuthRequested: true, previousRoute: previousRoute });
        }
    }, [isAuthenticated]);
    const { data, error } = useSWR<IUserBalance, Error>("/api/users/account/balance", apiFetcher);
    const { mutate } = useSWRConfig();
    const balanceInput = useRef<HTMLInputElement>(null);
    const [errMsg, setErrMsg] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const previousRoute = useLocation().state;

    if (error) {
        return <div>{error.message}</div>;
    }

    const transferMoney = () => {
        const money = Number(balanceInput.current?.value);
        if (money <= 0) {
            setErrMsg("Please enter a positive amount");
            return;
        }
        balanceInput.current!.value = "";
        setErrMsg("");
        fetch(
            "/api/users/account/balance",
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        balance: money
                    }
                ),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => manageErrors(response))
            .then(() => {
                setSnackBarOpen(true);
                mutate("/api/users/account/balance");
            })
            .catch((error: Error) => setErrMsg(error.message));;
    }
    return (
        <>
            <Box sx={{ display: 'flex', mt: "10px" }}>
                <Grid container direction="column" spacing={2}>
                    <Grid item spacing={2} container>
                        <Grid item>
                            <Typography variant="body1">Your Balance: </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">${data?.balance || 0}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="stretch">
                        <Grid item>
                            <TextField inputRef={balanceInput} type="number" />
                        </Grid>
                        <Grid item style={{ display: "flex" }}>
                            <Button onClick={transferMoney} variant="contained">
                                Add Balance
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="red">{errMsg}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackBarOpen(false)}
                message="Balance added"
            />
        </>
    )
}
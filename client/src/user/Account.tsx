import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useRef, useState } from "react";
import { manageErrors } from "../utils/DataFetcher";





export const Account = () => {
    const balanceInput = useRef<HTMLInputElement>(null);
    const [errMsg, setErrMsg] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const transferMoney = () => {
        const money = Number(balanceInput.current?.value);
        if (money <= 0) {
            setErrMsg("Please enter a positive amount");
            return;
        }
        setErrMsg("");
        fetch(
            "/users/account/balance",
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
                            <Typography variant="body1">$100.00 </Typography>
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
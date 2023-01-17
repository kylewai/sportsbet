import { useRef, useContext, useState, useEffect, ChangeEvent } from 'react';
import { AuthContext } from './auth/AuthProvider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { TransitionGroup } from 'react-transition-group';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { deepOrange } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, IconButton, Snackbar, Collapse } from '@mui/material';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { BetSlipContext, IBetSlip, IBetSlipInfo } from './BetSlipProvider';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { betTypeToString } from './models/BettingLine';
import CloseIcon from '@mui/icons-material/Close';
import { getBetCellIdInfo, getFavoriteOrUnderdog, getOverOrUnder } from './utils/betUtils';
import { IBet } from './models/Bet';
import { manageErrors } from './utils/DataFetcher';

const authFormStyle = {
    position: 'fixed',
    bottom: '0',
    left: '40%',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: "8px",
    boxShadow: 24,
    p: 0,
    textAlign: 'center'
};

interface IWagerFields {
    [betCellId: string]: HTMLInputElement;
}

interface IWagerValues {
    [betCellId: string]: number;
}

interface IFieldErrors {
    [betCellId: string]: string;
}

export const BetSlip = () => {
    const { isAuthenticated, setAuthRequest } = useContext(AuthContext);
    const wagerTextFields = useRef<IWagerFields>({});
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();
    const { betSlip, setBetSlipInfo } = useContext(BetSlipContext);
    const [errorTexts, setErrorTexts] = useState<IFieldErrors>({});
    const [expanded, setExpanded] = useState(true);
    const previousRoute = useLocation().state;

    function getWagerFields() {
        return wagerTextFields.current;
    }

    useEffect(() => {
        if (!isAuthenticated) {
            setAuthRequest({ isAuthRequested: true, previousRoute: previousRoute, onAuthCancelled: () => setBetSlipInfo({}) });
        }
        validateWagerFields();
    }, [isAuthenticated]);

    const onClose = () => {
        // updateBetSlipWagerValues();
        // navigate(-1);
    }

    const handleWagerChange = (e: ChangeEvent<HTMLInputElement>) => {
        validateWagerField(+e.currentTarget.value, e.currentTarget.name);
        if (errMsg) {
            setErrMsg("");
        }
    }

    const onPlaceBetClicked = () => {
        if (!validateWagerFields()) {
            setErrMsg("Fix errors to place your bet");
            return;
        }
        const placeBetInfo = Object.keys(betSlip).map((betCellId): IBet => {
            const info = betSlip[betCellId];
            return {
                bettingLineId: info.betId,
                odds: +info.odds,
                spread: info.spread === undefined ? undefined : +info.spread!,
                gameTotal: info.gameTotal === undefined ? undefined : +info.gameTotal!,
                wager: +getWagerFields()[betCellId].value ?? 0,
                favoriteOrUnderdog: getFavoriteOrUnderdog(info),
                overOrUnder: getOverOrUnder(info),
            }
        });

        fetch("/users/placebet",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    placeBetInfo: placeBetInfo
                })
            })
            .then((response) => manageErrors(response))
            .then(() => {
                setBetSlipInfo({});
                navigate(-1);
            })
            .catch((error: Error) => setErrMsg(error.message));
    }

    const updateBetSlipWagerValues = () => {
        const wagerFields = getWagerFields();
        const newBetSlipInfo = { ...betSlip };
        Object.keys(newBetSlipInfo).forEach((betCellId, index) => {
            newBetSlipInfo[betCellId] = {
                ...newBetSlipInfo[betCellId],
                wager: Number(wagerFields[betCellId].value)
            }
        });
        setBetSlipInfo(newBetSlipInfo);
    }

    const getWagerValues = () => {
        const wagerFields = getWagerFields();
        const wagerValues: IWagerValues = {};
        if (Object.keys(wagerFields).length === 0) { //no refs because not rendered yet
            Object.keys(betSlip).forEach(betCellId => wagerValues[betCellId] = betSlip[betCellId].wager ?? 0);
        }
        else {
            Object.keys(wagerFields).forEach(betCellId => wagerValues[betCellId] = +wagerFields[betCellId].value ?? 0)
        }
        return wagerValues;
    }

    const removeBetSlipInfo = (betCellId: string) => {
        setBetSlipInfo(info => {
            const newInfo = { ...info };
            delete newInfo[betCellId];
            return newInfo;
        });
        clearError(betCellId);
    }

    const removeAllBetSlipInfo = () => {
        setBetSlipInfo({});
    }

    const validateWagerFields = () => {
        let hasError = false;
        const wagerValues = getWagerValues();
        Object.keys(wagerValues).forEach((betCellId) => {
            hasError = !validateWagerField(wagerValues[betCellId], betCellId) || hasError;
        });
        return !hasError;
    }

    const validateWagerField = (wagerFieldValue: number, betCellId: string) => {
        let errorText = checkNegativeField(wagerFieldValue);
        if (!errorText) { //No error
            clearError(betCellId);
            return true;
        }
        setErrorTexts(currErrTexts => {
            const newErrors = { ...currErrTexts };
            newErrors[betCellId] = errorText;
            return newErrors;
        });
        return false;
    }

    const clearError = (betCellId: string) => {
        setErrorTexts(currErrTexts => {
            const newErrTxts = { ...currErrTexts };
            delete newErrTxts[betCellId];
            return newErrTxts;
        });
    }

    return (
        (betSlip
            && Object.keys(betSlip).length === 0)
            || !isAuthenticated
            ? null :
            <ClickAwayListener onClickAway={() => setExpanded(false)}>
                <Box component="div" sx={authFormStyle}>
                    <BetSlipHeader onClick={() => setExpanded(expanded => !expanded)} numBets={Object.keys(betSlip).length} />
                    <Divider />
                    <Collapse in={expanded}>
                        {Object.keys(betSlip).length > 1 &&
                            <RemoveAllBetSlipInfo onClick={removeAllBetSlipInfo} />}
                        <Divider />
                        <List style={{ maxHeight: "300px", overflow: "auto" }}>
                            <TransitionGroup>
                                {Object.keys(betSlip).map((betCellId, index) =>
                                    <Collapse key={betCellId}>
                                        <ListItem>
                                            <Grid item container>
                                                <Grid item sm={1}>
                                                    <IconButton aria-label="close" onClick={() => removeBetSlipInfo(betCellId)}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item container sm={8} sx={{ paddingY: "5px", paddingLeft: "5px" }}>
                                                    <Grid item container direction="column" sm={9}>
                                                        <Grid item>
                                                            <Typography align="left">
                                                                {betSlip[betCellId].chosenTeam?.name}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body2" align="left">
                                                                {betTypeToString(getBetCellIdInfo(betCellId).betType)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body2" align="left">{betSlip[betCellId].matchSummary}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item container direction="column" justifyContent="flex-start" alignContent="flex-end" sm={3} style={{ paddingRight: "5px" }}>
                                                        <Grid item>
                                                            <Typography variant="body2" align="center">{betSlip[betCellId].odds}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography sx={{ fontSize: "0.75rem" }} align="center">
                                                                {betSlip[betCellId].spread || (betSlip[betCellId].gameTotal && (getOverOrUnder(betSlip[betCellId]) ? "O " + betSlip[betCellId].gameTotal : "U " + betSlip[betCellId].gameTotal))}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item sm={3}>
                                                    <TextField inputRef={node => {
                                                        const wagerFields = getWagerFields();
                                                        if (node) {
                                                            // Add to the Map
                                                            wagerFields[betCellId] = node;
                                                        } else {
                                                            // Remove from the Map
                                                            delete wagerFields[betCellId];
                                                        }
                                                    }}
                                                        name={betCellId}
                                                        error={errorTexts[betCellId] != null}
                                                        helperText={errorTexts[betCellId]}
                                                        autoFocus={index == Object.keys(betSlip).length - 1}
                                                        onChange={handleWagerChange}
                                                        // inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                        type="number"
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </Collapse>
                                )
                                }
                            </TransitionGroup>
                        </List>
                        <Divider />
                        <Grid item container justifyContent="space-between">
                            <Grid item sx={{ paddingY: "5px", paddingLeft: "5px" }}>
                                <Typography variant="body1" align="left">Total payout: </Typography>
                            </Grid>
                            <Grid item sm={3}>
                                <TextField InputProps={{ readOnly: true }} type="number" variant="filled" value={calculateTotalPayout(betSlip, getWagerValues())} />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography variant="body1" color="red">{errMsg}</Typography>
                        <Box>
                            <Button onClick={onPlaceBetClicked} fullWidth variant="contained" size="large">
                                Place Bet
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            </ClickAwayListener>
    )
}

const calculateTotalPayout = (betSlipInfo: IBetSlip, wagerFields: IWagerValues) => {
    return Object.keys(betSlipInfo).reduce((total, betCellId) => {
        const wager = wagerFields[betCellId];
        const payout = calculatePayout(betSlipInfo[betCellId], wager);
        return total + payout;
    }, 0);
}

const calculatePayout = (info: IBetSlipInfo, wager: number) => {
    const numberOdds = Number(info.odds);
    if (numberOdds < 0) {
        return wager * 100 / Math.abs(numberOdds);
    }
    else {
        return wager * Math.abs(numberOdds) / 100;
    }
}
const checkNegativeField = (inputValue: number) => {
    return +inputValue < 0 ? "Wager cannot be negative\n" : "";
}

interface IBetSlipHeaderProps {
    numBets: number;
    onClick: () => void;
}
const BetSlipHeader = ({ numBets, onClick }: IBetSlipHeaderProps) => {
    return (
        <Grid onClick={onClick} container spacing={1} sx={{ paddingY: "10px", paddingLeft: "5px", cursor: "pointer" }}>
            <Grid item>
                <Typography align="left">Bet Slip</Typography>
            </Grid>
            <Grid item>
                <Avatar sx={{ bgcolor: deepOrange[500], width: 24, height: 24 }}>{numBets}</Avatar>
            </Grid>
        </Grid>
    )
}

const RemoveAllBetSlipInfo = (props: { onClick: () => void }) => {
    return (
        <Box sx={{ paddingY: "5px", paddingLeft: "5px" }}>
            <Typography
                variant="body2"
                align="left"
                onClick={props.onClick}
                sx={{ color: "#135eeb", cursor: "pointer" }}
                component="div">
                <Box sx={{ fontWeight: 'medium' }}>Remove All</Box>
            </Typography>
        </Box>
    )
}
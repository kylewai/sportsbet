import { useRef, useContext, useState, useEffect, ChangeEvent } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { TransitionGroup } from 'react-transition-group';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { deepOrange } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, IconButton, Collapse } from '@mui/material';
import { BetSlipContext, IBetSlip, IBetSlipItem } from '@betting/BetSlipProvider';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { betTypeToString } from '@models/BettingLine';
import CloseIcon from '@mui/icons-material/Close';
import { getBetCellIdInfo, getFavoriteOrUnderdog, getOverOrUnder } from '@utils/betting/betUtils';
import { IBet, IConfirmBetData } from '@models/Bet';
import { makePostReq, manageErrors } from '@utils/DataFetcher';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { PLACE_BET_URL } from '@utils/serverEndpoints';

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
    const wagerTextFields = useRef<IWagerFields>({});
    const [formErrMsg, setFormErrMsg] = useState("");
    const { betSlip, setBetSlipInfo, setShouldShowBetSlip } = useContext(BetSlipContext);
    const [errorTexts, setErrorTexts] = useState<IFieldErrors>({});
    const [expanded, setExpanded] = useState(true);
    const [confirmBetInfoObj, setConfirmBetInfoObj] = useState<{ [betCellId: string]: IConfirmBetData }>({});

    if (!betSlip || Object.keys(betSlip).length === 0) {
        setShouldShowBetSlip(false);
        return null;
    }

    const getWagerFields = () => {
        return wagerTextFields.current;
    }

    const handleWagerChange = (e: ChangeEvent<HTMLInputElement>) => {
        validateWagerField(+e.currentTarget.value, e.currentTarget.name);
        if (formErrMsg) { //Remove form error message once user modifies field to correct.
            setFormErrMsg("");
        }
    }

    const onPlaceBetClicked = () => {
        if (!validateWagerFields()) {
            setFormErrMsg("Fix errors to place your bet");
            return;
        }

        const placeBetInfo = getBetsToSend(betSlip, getWagerFields(), confirmBetInfoObj);

        makePostReq(PLACE_BET_URL, { placeBetInfo })
            .then(async (response) => {
                try {
                    const jsonRes = await response.json();
                    if (jsonRes) {
                        setConfirmBetInfoObj(jsonRes.data);
                        //display alert to confirm bet with changed data
                    }
                }
                catch {
                    setBetSlipInfo({});
                }
            })
            .catch((error: Error) => setFormErrMsg(error.message));
    }

    const getWagerValues = () => {
        const wagerFields = getWagerFields();
        const wagerValues: IWagerValues = {};
        if (Object.keys(wagerFields).length === 0) { //no refs because not rendered yet
            Object.keys(betSlip).forEach(betCellId => wagerValues[betCellId] = 0);
        }
        else {
            Object.keys(wagerFields).forEach(betCellId => wagerValues[betCellId] = +wagerFields[betCellId].value ?? 0)
        }
        return wagerValues;
    }

    const removeBetSlipItem = (betCellId: string) => {
        setBetSlipInfo(info => {
            const newInfo = { ...info };
            delete newInfo[betCellId];
            return newInfo;
        });
        clearError(betCellId);
    }

    const clearBetSlip = () => {
        setBetSlipInfo({});
    }

    //True if no errors in wager fields
    const validateWagerFields = () => {
        let hasError = false;
        const wagerValues = getWagerValues();
        Object.keys(wagerValues).forEach((betCellId) => {
            hasError = !validateWagerField(wagerValues[betCellId], betCellId) || hasError;
        });
        return !hasError;
    }

    //Returns true if wager field has no errors.
    //SIDE EFFECT: adding inline error text to field
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

    const handleConfirmClose = () => {
        setBetSlipInfo(info => reconcileConfirmBetSlipState(confirmBetInfoObj, info));
        setConfirmBetInfoObj({});
    }

    return (
        <>
            <ClickAwayListener onClickAway={() => setExpanded(false)}>
                <Box component="div" sx={authFormStyle}>
                    <BetSlipHeader onClick={() => setExpanded(expanded => !expanded)} numBets={Object.keys(betSlip).length} />
                    <Divider />
                    <Collapse in={expanded}>
                        {Object.keys(betSlip).length > 1 &&
                            <RemoveAllBetSlipInfo onClick={clearBetSlip} />}
                        <Divider />
                        <BetSlipItemsList
                            betSlip={betSlip}
                            removeBetSlipItem={removeBetSlipItem}
                            wagerFields={getWagerFields()}
                            errorTexts={errorTexts}
                            handleWagerChange={handleWagerChange} />
                        <Divider />
                        <TotalPayoutDisplay betSlip={betSlip} wagerValues={getWagerValues()} />
                        <Divider />
                        <Typography variant="body1" color="red">{formErrMsg}</Typography>
                        <Box>
                            <Button onClick={onPlaceBetClicked} fullWidth variant="contained" size="large">
                                Place Bet
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            </ClickAwayListener>
            <ConfirmBetDialog
                confirmBetInfoObj={confirmBetInfoObj}
                betSlip={betSlip}
                onConfirmBet={() => onPlaceBetClicked()}
                onCancel={handleConfirmClose} />
        </>
    )
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

interface IBetSlipItemsListProps {
    betSlip: IBetSlip;
    removeBetSlipItem: (betCellId: string) => void;
    wagerFields: IWagerFields;
    handleWagerChange: (e: ChangeEvent<HTMLInputElement>) => void;
    errorTexts: IFieldErrors;
}

const BetSlipItemsList = ({ betSlip, removeBetSlipItem, wagerFields, handleWagerChange, errorTexts }: IBetSlipItemsListProps) => {
    return (
        <List style={{ maxHeight: "300px", overflow: "auto" }}>
            <TransitionGroup>
                {Object.keys(betSlip).map((betCellId, index) =>
                    <Collapse key={betCellId}>
                        <ListItem>
                            <Grid item container>
                                <Grid item sm={1}>
                                    <IconButton aria-label="close" onClick={() => removeBetSlipItem(betCellId)}>
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
    )
}

interface ITotalPayoutDisplayProps {
    betSlip: IBetSlip;
    wagerValues: IWagerValues;
}

const TotalPayoutDisplay = ({ betSlip, wagerValues }: ITotalPayoutDisplayProps) => {
    return (
        <Grid item container justifyContent="space-between">
            <Grid item sx={{ paddingY: "5px", paddingLeft: "5px" }}>
                <Typography variant="body1" align="left">Total payout: </Typography>
            </Grid>
            <Grid item sm={3}>
                <TextField InputProps={{ readOnly: true }} type="number" variant="filled" value={calculateTotalPayout(betSlip, wagerValues)} />
            </Grid>
        </Grid>
    )
}

interface IConfirmBetDialogProps {
    confirmBetInfoObj: { [betCellId: string]: IConfirmBetData };
    betSlip: IBetSlip;
    onConfirmBet: () => void;
    onCancel: () => void;
}

const ConfirmBetDialog = ({ confirmBetInfoObj, betSlip, onConfirmBet, onCancel }: IConfirmBetDialogProps) => {
    return (
        <Dialog open={Object.keys(confirmBetInfoObj).length > 0} onClose={onCancel}>
            <DialogContent>
                <p>The betting lines were updated. Review the changes to confirm your bet</p>
                <ul>
                    {
                        Object.keys(confirmBetInfoObj).map((betCellId, index) =>
                            <li key={index}>
                                <p>{(betSlip[betCellId].chosenTeam?.name ?? ("Game Total " + (getOverOrUnder(betSlip[betCellId]) ? "O" : "U"))) + " (" + betSlip[betCellId].matchSummary + ")"}</p>
                                {confirmBetInfoObj[betCellId].betPlacedOdds && <p>Original odds: {confirmBetInfoObj[betCellId].betPlacedOdds}</p>}
                                {confirmBetInfoObj[betCellId].currOdds && <p>Updated odds: {confirmBetInfoObj[betCellId].currOdds}</p>}
                                {confirmBetInfoObj[betCellId].betPlacedGameTotal && <p>Original game total: {confirmBetInfoObj[betCellId].betPlacedGameTotal}</p>}
                                {confirmBetInfoObj[betCellId].currGameTotal && <p>Updated game total: {confirmBetInfoObj[betCellId].currGameTotal}</p>}
                                {confirmBetInfoObj[betCellId].betPlacedSpread && <p>Original spread: {confirmBetInfoObj[betCellId].betPlacedSpread}</p>}
                                {confirmBetInfoObj[betCellId].currSpread && <p>Updated spread: {confirmBetInfoObj[betCellId].currSpread}</p>}
                            </li>
                        )
                    }
                </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirmBet}>Accept</Button>
                <Button onClick={onCancel} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

/**
 * Calculates total payout based on wagers in the bet slip
 * @param betSlipInfo Bet slip containing the bet slip items
 * @param wagerValues BetCellId-indexed array of wager field values
 * @returns Total payout
 */
const calculateTotalPayout = (betSlipInfo: IBetSlip, wagerValues: IWagerValues) => {
    return Object.keys(betSlipInfo).reduce((total, betCellId) => {
        const wager = wagerValues[betCellId];
        const payout = calculatePayout(betSlipInfo[betCellId], wager);
        return total + payout;
    }, 0);
}

/**
 * Calculates payout for a single bet slip item
 * @param item Bet slip item
 * @param wager Wager value
 * @returns Payout
 */
const calculatePayout = (item: IBetSlipItem, wager: number) => {
    const numberOdds = Number(item.odds);
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

/**
 * Reconciles ONE updated betting line info from the server in response to
 * the previous attempt to place bet with stale info.
 * @param confirmBetData Up-to-date betting line info 
 * @param betSlipItem Existing bet slip item containing info that needs updating
 */
const reconcileConfirmInfo = (confirmBetData: IConfirmBetData, betSlipItem: IBetSlipItem) => {
    if (confirmBetData.currGameTotal) {
        betSlipItem.gameTotal = confirmBetData.currGameTotal;
    }

    if (confirmBetData.currSpread) {
        betSlipItem.spread = confirmBetData.currSpread;
    }

    if (confirmBetData.currOdds) {
        betSlipItem.odds = confirmBetData.currOdds;
    }
}

/**
 * Reconciles all updated betting line info from the server
 * @param confirmBetInfoObj Up-to-date betting line info
 * @param betSlip Bet slip containing all bet slip items
 * @returns Updated bet slip
 */
const reconcileConfirmBetSlipState = (confirmBetInfoObj: { [betCellId: string]: IConfirmBetData }, betSlip: IBetSlip) => {
    return Object.keys(confirmBetInfoObj).reduce<IBetSlip>((newBetSlip, betCellId) => {
        const newBetSlipItem = Object.assign({}, betSlip[betCellId]);
        reconcileConfirmInfo(confirmBetInfoObj[betCellId], newBetSlipItem);
        newBetSlip[betCellId] = newBetSlipItem;
        return newBetSlip;
    }, {});
}

/**
 * Convert bet slip information into correct schema to send to server.
 * @param betSlip Bet slip
 * @param wagerFields Wager field elements
 * @param confirmBetInfoObj OPTIONAL - Updated betting line info from the server, if any
 * @returns Array of IBet objects
 */
const getBetsToSend = (betSlip: IBetSlip, wagerFields: IWagerFields, confirmBetInfoObj?: { [betCellId: string]: IConfirmBetData }) => {
    return Object.keys(betSlip).map((betCellId): IBet => {
        const item = Object.assign({}, betSlip[betCellId]);
        if (confirmBetInfoObj && confirmBetInfoObj[betCellId]) {
            reconcileConfirmInfo(confirmBetInfoObj[betCellId], item);
        }
        return {
            bettingLineId: item.betId,
            odds: item.odds,
            spread: item.spread,
            gameTotal: item.gameTotal,
            wager: +wagerFields[betCellId].value ?? 0,
            favoriteOrUnderdog: getFavoriteOrUnderdog(item),
            overOrUnder: getOverOrUnder(item),
        };
    });
}
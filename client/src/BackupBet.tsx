// import { useRef, useContext, useState, useEffect, ChangeEvent } from 'react';
// import { AuthContext } from './auth/AuthProvider';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { Typography, IconButton } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { BetSlipContext, IBetSlipInfo } from './BetSlipProvider';
// import Grid from '@mui/material/Grid';
// import Divider from '@mui/material/Divider';
// import { betTypeToString } from './models/BettingLine';
// import CloseIcon from '@mui/icons-material/Close';
// import { getBetCellIdInfo, getFavoriteOrUnderdog, getOverOrUnder } from './utils/betUtils';
// import { IBet } from './models/Bet';
// import { manageErrors } from './utils/DataFetcher';

// const authFormStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 0,
//     textAlign: 'center'
// };

// export const BetSlip = () => {
//     const { isAuthenticated, setAuthRequest } = useContext(AuthContext);
//     const wagerTextFields = useRef<Map<number, HTMLInputElement> | null>(null);
//     const [totalPayout, setTotalPayout] = useState(0);
//     const [errMsg, setErrMsg] = useState("");
//     const navigate = useNavigate();
//     const { betSlip: betSlipInfo, setBetSlipInfo } = useContext(BetSlipContext);

//     function getWagerFields() {
//         if (!wagerTextFields.current) {
//             // Initialize the Map on first usage.
//             wagerTextFields.current = new Map();
//         }
//         return wagerTextFields.current;
//     }

//     useEffect(() => {
//         if (!isAuthenticated) {
//             setAuthRequest({ isAuthRequested: true, previousRoute: -1 });
//         }
//         setTotalPayout(calculateTotalPayout(betSlipInfo, getWagerValues()));
//     }, []);

//     const onClose = () => {
//         const newBetSlipInfo = betSlipInfo.map((info, index) => {
//             return {
//                 ...info,
//                 wager: Number(getWagerFields().get(index)?.value)
//             }
//         });
//         setBetSlipInfo(newBetSlipInfo);
//         navigate(-1);
//     }

//     const handleWagerChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setTotalPayout(calculateTotalPayout(betSlipInfo, getWagerValues()));
//     }

//     const getWagerValues = () => {
//         if (Array.from(getWagerFields().values()).length === 0) { //no refs because not rendered yet
//             return betSlipInfo.map(info => info.wager ?? 0);
//         }
//         return Array.from(getWagerFields().values()).map(element => Number(element.value) ?? 0);
//     }

//     const removeBetSlipInfo = (betCellId: string) => {
//         setBetSlipInfo(info => {
//             return info.filter(info => info.betCellId !== betCellId);
//         });
//     }

//     const onPlaceBetClicked = () => {
//         //validateWagerFields();
//         const placeBetInfo = betSlipInfo.map((info, index): IBet => {
//             return {
//                 bettingLineId: info.betId,
//                 odds: +info.odds,
//                 spread: info.spread === undefined ? undefined : +info.spread!,
//                 gameTotal: info.gameTotal === undefined ? undefined : +info.gameTotal!,
//                 wager: +getWagerFields().get(index)?.value! ?? 0,
//                 favoriteOrUnderdog: getFavoriteOrUnderdog(info),
//                 overOrUnder: getOverOrUnder(info),
//             }
//         });

//         fetch("/users/placebet",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     placeBetInfo: placeBetInfo
//                 })
//             })
//             .then((response) => manageErrors(response))
//             .then(() => {
//                 setBetSlipInfo([]);
//             })
//             .catch((error: Error) => setErrMsg(error.message));
//     }

//     return (
//         <Modal
//             open={isAuthenticated}
//             onClose={onClose}
//             title={"Bet Slip"}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//         >
//             <Box sx={authFormStyle} component="div">
//                 <Box sx={{ paddingY: "5px", paddingLeft: "5px" }}>
//                     <Typography align="left">Bet Slip</Typography>
//                 </Box>
//                 <Divider />
//                 <Box sx={{ paddingY: "5px", paddingLeft: "5px" }}>
//                     <Typography align="left">Remove All</Typography>
//                 </Box>
//                 <Divider />
//                 <Grid container>
//                     {betSlipInfo.map((info, index) =>
//                         <Grid item container key={info.betCellId}>
//                             <Grid item sm={1}>
//                                 <IconButton aria-label="close" onClick={() => removeBetSlipInfo(info.betCellId)}>
//                                     <CloseIcon />
//                                 </IconButton>
//                             </Grid>
//                             <Grid item container sm={8} sx={{ paddingY: "5px", paddingLeft: "5px" }}>
//                                 <Grid item container direction="column" sm={9}>
//                                     <Grid item>
//                                         <Typography variant="body2" align="left">{info.chosenTeam?.name}</Typography>
//                                     </Grid>
//                                     <Grid item>
//                                         <Typography variant="body2" align="left">{betTypeToString(getBetCellIdInfo(info.betCellId).betType)}</Typography>
//                                     </Grid>
//                                     <Grid item>
//                                         <Typography variant="body2" align="left">{info.matchSummary}</Typography>
//                                     </Grid>
//                                 </Grid>
//                                 <Grid item container direction="column" justifyContent="flex-start" alignContent="flex-end" sm={3} style={{ paddingRight: "5px" }}>
//                                     <Grid item>
//                                         <Typography variant="body2" align="center">{info.odds}</Typography>
//                                     </Grid>
//                                     <Grid item>
//                                         <Typography sx={{ fontSize: "0.75rem" }} align="center">
//                                             {info.spread || (info.gameTotal && (getOverOrUnder(info) ? "O " + info.gameTotal : "U " + info.gameTotal))}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                             <Grid item sm={3}>
//                                 <TextField inputRef={node => {
//                                     const map = getWagerFields();
//                                     if (node) {
//                                         // Add to the Map
//                                         map.set(index, node);
//                                     } else {
//                                         // Remove from the Map
//                                         map.delete(index);
//                                     }
//                                 }}
//                                     autoFocus={index == betSlipInfo.length - 1}
//                                     onChange={handleWagerChange}
//                                     type="number" variant="outlined" defaultValue={info.wager} />
//                             </Grid>
//                         </Grid>
//                     )
//                     }
//                 </Grid>
//                 <Divider />
//                 <Grid item container justifyContent="space-between">
//                     <Grid item sx={{ paddingY: "5px", paddingLeft: "5px" }}>
//                         <Typography variant="body1" align="left">Total payout: </Typography>
//                     </Grid>
//                     <Grid item sm={3}>
//                         <TextField InputProps={{ readOnly: true }} type="number" variant="filled" value={totalPayout} />
//                     </Grid>
//                 </Grid>
//                 <Divider />
//                 <Typography variant="body1" color="red">{errMsg}</Typography>
//                 <Box>
//                     <Button onClick={onPlaceBetClicked} fullWidth variant="contained" size="large">
//                         Place Bet
//                     </Button>
//                 </Box>
//             </Box>
//         </Modal>
//     )
// }

// const calculateTotalPayout = (betSlipInfo: IBetSlipInfo[], wagerFields: number[]) => {
//     return betSlipInfo.reduce((total, info, index) => {
//         const wager = wagerFields[index];
//         const payout = calculatePayout(info, wager);
//         return total + payout;
//     }, 0);
// }

// const calculatePayout = (info: IBetSlipInfo, wager: number) => {
//     const numberOdds = Number(info.odds);
//     if (numberOdds < 0) {
//         return wager * 100 / Math.abs(numberOdds);
//     }
//     else {
//         return wager * Math.abs(numberOdds) / 100;
//     }
// }
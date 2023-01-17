"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetSlip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AuthProvider_1 = require("./auth/AuthProvider");
const Modal_1 = __importDefault(require("@mui/material/Modal"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const material_1 = require("@mui/material");
const react_router_dom_1 = require("react-router-dom");
const BetSlipProvider_1 = require("./BetSlipProvider");
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Divider_1 = __importDefault(require("@mui/material/Divider"));
const BettingLine_1 = require("./models/BettingLine");
const Close_1 = __importDefault(require("@mui/icons-material/Close"));
const betUtils_1 = require("./utils/betUtils");
const DataFetcher_1 = require("./utils/DataFetcher");
const authFormStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 0,
    textAlign: 'center'
};
const BetSlip = () => {
    const { isAuthenticated, setAuthRequest } = (0, react_1.useContext)(AuthProvider_1.AuthContext);
    const wagerTextFields = (0, react_1.useRef)(null);
    const [totalPayout, setTotalPayout] = (0, react_1.useState)(0);
    const [errMsg, setErrMsg] = (0, react_1.useState)("");
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { betSlipInfo, setBetSlipInfo } = (0, react_1.useContext)(BetSlipProvider_1.BetSlipContext);
    const [snackBarOpen, setSnackBarOpen] = (0, react_1.useState)(false);
    function getWagerFields() {
        if (!wagerTextFields.current) {
            // Initialize the Map on first usage.
            wagerTextFields.current = new Map();
        }
        return wagerTextFields.current;
    }
    (0, react_1.useEffect)(() => {
        if (!isAuthenticated) {
            setAuthRequest({ isAuthRequested: true, previousRoute: -1 });
        }
        setTotalPayout(calculateTotalPayout(betSlipInfo, getWagerValues()));
    }, []);
    const onClose = () => {
        const newBetSlipInfo = betSlipInfo.map((info, index) => {
            var _a;
            return Object.assign(Object.assign({}, info), { wager: Number((_a = getWagerFields().get(index)) === null || _a === void 0 ? void 0 : _a.value) });
        });
        setBetSlipInfo(newBetSlipInfo);
        navigate(-1);
    };
    const handleWagerChange = (e) => {
        setTotalPayout(calculateTotalPayout(betSlipInfo, getWagerValues()));
    };
    const getWagerValues = () => {
        if (Array.from(getWagerFields().values()).length === 0) { //no refs because not rendered yet
            return betSlipInfo.map(info => { var _a; return (_a = info.wager) !== null && _a !== void 0 ? _a : 0; });
        }
        return Array.from(getWagerFields().values()).map(element => { var _a; return (_a = Number(element.value)) !== null && _a !== void 0 ? _a : 0; });
    };
    const removeBetSlipInfo = (betCellId) => {
        setBetSlipInfo(info => {
            return info.filter(info => info.betCellId !== betCellId);
        });
    };
    const removeAllBetSlipInfo = () => {
        setBetSlipInfo([]);
    };
    const onPlaceBetClicked = () => {
        //validateWagerFields();
        const placeBetInfo = betSlipInfo.map((info, index) => {
            var _a, _b;
            return {
                bettingLineId: info.betId,
                odds: +info.odds,
                spread: info.spread === undefined ? undefined : +info.spread,
                gameTotal: info.gameTotal === undefined ? undefined : +info.gameTotal,
                wager: (_b = +((_a = getWagerFields().get(index)) === null || _a === void 0 ? void 0 : _a.value)) !== null && _b !== void 0 ? _b : 0,
                favoriteOrUnderdog: (0, betUtils_1.getFavoriteOrUnderdog)(info),
                overOrUnder: (0, betUtils_1.getOverOrUnder)(info),
            };
        });
        fetch("/users/placebet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                placeBetInfo: placeBetInfo
            })
        })
            .then((response) => (0, DataFetcher_1.manageErrors)(response))
            .then(() => {
            setBetSlipInfo([]);
            setSnackBarOpen(true);
            navigate(-1);
        })
            .catch((error) => setErrMsg(error.message));
    };
    // const validateWagerFields = () => {
    //     getWagerFields().
    // }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(Modal_1.default, Object.assign({ open: isAuthenticated, onClose: onClose, title: "Bet Slip", "aria-labelledby": "modal-modal-title", "aria-describedby": "modal-modal-description" }, { children: (0, jsx_runtime_1.jsxs)(Box_1.default, Object.assign({ sx: authFormStyle, component: "div" }, { children: [(0, jsx_runtime_1.jsx)(Box_1.default, Object.assign({ sx: { paddingY: "5px", paddingLeft: "5px" } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "left" }, { children: "Bet Slip" })) })), (0, jsx_runtime_1.jsx)(Divider_1.default, {}), betSlipInfo.length > 1 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Box_1.default, Object.assign({ sx: { paddingY: "5px", paddingLeft: "5px" } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ variant: "body2", align: "left", onClick: removeAllBetSlipInfo, sx: { color: "#135eeb", cursor: "pointer" }, component: "div" }, { children: (0, jsx_runtime_1.jsx)(Box_1.default, Object.assign({ sx: { fontWeight: 'medium' } }, { children: "Remove All" })) })) })), (0, jsx_runtime_1.jsx)(Divider_1.default, {})] })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ container: true }, { children: betSlipInfo.map((info, index) => {
                            var _a;
                            return (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 1 }, { children: (0, jsx_runtime_1.jsx)(material_1.IconButton, Object.assign({ "aria-label": "close", onClick: () => removeBetSlipInfo(info.betCellId) }, { children: (0, jsx_runtime_1.jsx)(Close_1.default, {}) })) })), (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, sm: 8, sx: { paddingY: "5px", paddingLeft: "5px" } }, { children: [(0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, direction: "column", sm: 9 }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "left" }, { children: (_a = info.chosenTeam) === null || _a === void 0 ? void 0 : _a.name })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ variant: "body2", align: "left" }, { children: (0, BettingLine_1.betTypeToString)((0, betUtils_1.getBetCellIdInfo)(info.betCellId).betType) })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ variant: "body2", align: "left" }, { children: info.matchSummary })) }))] })), (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, direction: "column", justifyContent: "flex-start", alignContent: "flex-end", sm: 3, style: { paddingRight: "5px" } }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ variant: "body2", align: "center" }, { children: info.odds })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ sx: { fontSize: "0.75rem" }, align: "center" }, { children: info.spread || (info.gameTotal && ((0, betUtils_1.getOverOrUnder)(info) ? "O " + info.gameTotal : "U " + info.gameTotal)) })) }))] }))] })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(TextField_1.default, { inputRef: node => {
                                                const map = getWagerFields();
                                                if (node) {
                                                    // Add to the Map
                                                    map.set(index, node);
                                                }
                                                else {
                                                    // Remove from the Map
                                                    map.delete(index);
                                                }
                                            }, autoFocus: index == betSlipInfo.length - 1, onChange: handleWagerChange, inputProps: { inputMode: 'numeric', pattern: '[0-9]*' }, 
                                            // type="number" 
                                            variant: "outlined", defaultValue: info.wager }) }))] }), info.betCellId);
                        }) })), (0, jsx_runtime_1.jsx)(Divider_1.default, {}), (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, justifyContent: "space-between" }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sx: { paddingY: "5px", paddingLeft: "5px" } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ variant: "body1", align: "left" }, { children: "Total payout: " })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(TextField_1.default, { InputProps: { readOnly: true }, type: "number", variant: "filled", value: totalPayout }) }))] })), (0, jsx_runtime_1.jsx)(Divider_1.default, {}), (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ variant: "body1", color: "red" }, { children: errMsg })), (0, jsx_runtime_1.jsx)(Box_1.default, { children: (0, jsx_runtime_1.jsx)(Button_1.default, Object.assign({ onClick: onPlaceBetClicked, fullWidth: true, variant: "contained", size: "large" }, { children: "Place Bet" })) }), (0, jsx_runtime_1.jsx)(material_1.Snackbar, { autoHideDuration: 3000, onClose: () => setSnackBarOpen(false), message: "Balance added" })] })) })) }));
};
exports.BetSlip = BetSlip;
const calculateTotalPayout = (betSlipInfo, wagerFields) => {
    return betSlipInfo.reduce((total, info, index) => {
        const wager = wagerFields[index];
        const payout = calculatePayout(info, wager);
        return total + payout;
    }, 0);
};
const calculatePayout = (info, wager) => {
    const numberOdds = Number(info.odds);
    if (numberOdds < 0) {
        return wager * 100 / Math.abs(numberOdds);
    }
    else {
        return wager * Math.abs(numberOdds) / 100;
    }
};

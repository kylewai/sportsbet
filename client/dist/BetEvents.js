"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BettingEventsList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Icons_1 = require("./utils/Icons");
const swr_1 = __importDefault(require("swr"));
const react_router_dom_1 = require("react-router-dom");
const BettingLine_1 = require("./models/BettingLine");
const DataFetcher_1 = require("./utils/DataFetcher");
const material_1 = require("@mui/material");
require("./App.css");
const react_1 = require("react");
const BetSlipProvider_1 = require("./BetSlipProvider");
const SportEventProvider_1 = require("./SportEventProvider");
const betUtils_1 = require("./utils/betUtils");
const BettingEventsList = () => {
    const { leagueId } = (0, react_router_dom_1.useParams)();
    const { data, error } = (0, swr_1.default)("/leagues/" + leagueId + "/events", DataFetcher_1.apiFetcher);
    if (error) {
        console.log(error.message);
        return (0, jsx_runtime_1.jsx)("div", { children: "failed to load" });
    }
    if (!data)
        return (0, jsx_runtime_1.jsx)("div", { children: "loading..." }); //TODO: Better loading UI
    const eventsByDate = getSportEventsByDate(data);
    return ((0, jsx_runtime_1.jsxs)(BetSlipProvider_1.BetSlipProvider, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ container: true, rowSpacing: 0, alignItems: "center", style: { userSelect: "none" } }, { children: Object.keys(eventsByDate).map((dateString, index) => ((0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ container: true }, { children: [(0, jsx_runtime_1.jsx)(EventHeader, { date: dateString }), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, container: true }, { children: eventsByDate[dateString].map((sportEvent, index) => (0, jsx_runtime_1.jsx)(SportEventOverview, { sportEvent: sportEvent }, index)) }))] }), index))) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {})] }));
};
exports.BettingEventsList = BettingEventsList;
const SportEventOverview = ({ sportEvent }) => {
    var _a, _b, _c;
    const time = getAMPMTime(new Date(sportEvent.dateTime));
    return ((0, jsx_runtime_1.jsx)(SportEventProvider_1.SportEventProvider, Object.assign({ sportEvent: sportEvent }, { children: (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, className: "sportEvent" }, { children: [(0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, sm: 6, style: { borderRight: "1px solid lightgray" }, alignItems: "center" }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: time })), (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, direction: "column", sm: 9 }, { children: [(0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ style: { display: "inline-block", verticalAlign: "middle" } }, { children: (0, jsx_runtime_1.jsx)(Icons_1.NormalIcon, { iconType: Icons_1.IconType.Team, iconKey: sportEvent.travelTeam.id }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { display: "inline-block", verticalAlign: "middle" } }, { children: sportEvent.travelTeam.name }))] })), (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ style: { display: "inline-block", verticalAlign: "middle" } }, { children: (0, jsx_runtime_1.jsx)(Icons_1.NormalIcon, { iconType: Icons_1.IconType.Team, iconKey: sportEvent.homeTeam.id }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { display: "inline-block", verticalAlign: "middle" } }, { children: sportEvent.homeTeam.name }))] }))] }))] })), (0, jsx_runtime_1.jsx)(BettingLineSection, { betData: (_a = sportEvent.bettingLines) === null || _a === void 0 ? void 0 : _a[BettingLine_1.BetType.Spread] }), (0, jsx_runtime_1.jsx)(BettingLineSection, { betData: (_b = sportEvent.bettingLines) === null || _b === void 0 ? void 0 : _b[BettingLine_1.BetType.GameTotal] }), (0, jsx_runtime_1.jsx)(BettingLineSection, { betData: (_c = sportEvent.bettingLines) === null || _c === void 0 ? void 0 : _c[BettingLine_1.BetType.MoneyLine] })] })) })));
};
const EventHeader = ({ date }) => {
    return ((0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, columnSpacing: 0 }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 6, style: { background: "black", color: "white" } }, { children: date })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 2, style: { background: "black", color: "white" } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center" }, { children: "Spread" })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 2, style: { background: "black", color: "white" } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center" }, { children: "Total" })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 2, style: { background: "black", color: "white" } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center" }, { children: "Money Line" })) }))] })));
};
const BettingLineSection = ({ betData }) => {
    const sportEvent = (0, react_1.useContext)(SportEventProvider_1.SportEventContext);
    const isFavoriteAbove = !sportEvent.isHomeTeamFavorite;
    if (!betData) {
        return ((0, jsx_runtime_1.jsx)(Grid_1.default, { item: true, sm: 6, sx: { paddingY: "10px" } }));
    }
    switch (betData.betType) {
        case BettingLine_1.BetType.MoneyLine: return (0, jsx_runtime_1.jsx)(MoneyBettingLineSection, { betData: betData, isFavoriteAbove: isFavoriteAbove });
        case BettingLine_1.BetType.Spread: return (0, jsx_runtime_1.jsx)(SpreadBettingLineSection, { betData: betData, isFavoriteAbove: isFavoriteAbove });
        case BettingLine_1.BetType.GameTotal: return (0, jsx_runtime_1.jsx)(GameTotalBettingLineSection, { betData: betData, isFavoriteAbove: isFavoriteAbove });
    }
};
const MoneyBettingLineSection = ({ betData, isFavoriteAbove }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { setBetSlipInfo } = (0, react_1.useContext)(BetSlipProvider_1.BetSlipContext);
    const sportEvent = (0, react_1.useContext)(SportEventProvider_1.SportEventContext);
    if (!betData) {
        return null;
    }
    const { favoriteOdds, underdogOdds } = (0, betUtils_1.getOddsData)(betData);
    const [favoriteBetSlipInfo, underdogBetSlipInfo] = getFavUnderdogBetSlipInfo(betData, sportEvent);
    if (betData.id === 13) {
        console.log(favoriteBetSlipInfo);
    }
    return ((0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, sm: 2, direction: "column", alignItems: "center" }, { children: [(0, jsx_runtime_1.jsx)(BettingLineCell, Object.assign({ id: isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId, betHandler: getBetHandler(isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, navigate, setBetSlipInfo) }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center", sx: { color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' } }, { children: isFavoriteAbove ? favoriteOdds : underdogOdds })) })), (0, jsx_runtime_1.jsx)(BettingLineCell, Object.assign({ id: !isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId, betHandler: getBetHandler(!isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, navigate, setBetSlipInfo) }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center", sx: { color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' } }, { children: !isFavoriteAbove ? favoriteOdds : underdogOdds })) }))] })));
};
const SpreadBettingLineSection = ({ betData, isFavoriteAbove }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { setBetSlipInfo } = (0, react_1.useContext)(BetSlipProvider_1.BetSlipContext);
    const sportEvent = (0, react_1.useContext)(SportEventProvider_1.SportEventContext);
    if (!betData) {
        return null;
    }
    const { favoriteSpread, underdogSpread, favoriteOdds, underdogOdds } = (0, betUtils_1.getOddsData)(betData);
    const [favoriteBetSlipInfo, underdogBetSlipInfo] = getFavUnderdogBetSlipInfo(betData, sportEvent);
    return ((0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, sm: 2, direction: "column", alignItems: "center" }, { children: [(0, jsx_runtime_1.jsxs)(BettingLineCell, Object.assign({ id: isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId, betHandler: getBetHandler(isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, navigate, setBetSlipInfo) }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center", sx: { paddingY: "10px", fontWeight: "light", fontSize: 'default' } }, { children: isFavoriteAbove ? favoriteSpread : underdogSpread })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center", sx: { color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' } }, { children: isFavoriteAbove ? favoriteOdds : underdogOdds })) }))] })), (0, jsx_runtime_1.jsxs)(BettingLineCell, Object.assign({ id: !isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId, betHandler: getBetHandler(!isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, navigate, setBetSlipInfo) }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center", sx: { paddingY: "10px", fontWeight: "light", fontSize: 'default' } }, { children: !isFavoriteAbove ? favoriteSpread : underdogSpread })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ align: "center", sx: { color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' } }, { children: !isFavoriteAbove ? favoriteOdds : underdogOdds })) }))] }))] })));
};
const GameTotalBettingLineSection = ({ betData }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { setBetSlipInfo } = (0, react_1.useContext)(BetSlipProvider_1.BetSlipContext);
    const sportEvent = (0, react_1.useContext)(SportEventProvider_1.SportEventContext);
    if (!betData) {
        return null;
    }
    const { overOdds, underOdds } = (0, betUtils_1.getOddsData)(betData);
    const [overBetSlipInfo, underBetSlipInfo] = getOverUnderBetSlipInfo(betData, sportEvent);
    return ((0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, direction: "column", sm: 2, alignItems: "center" }, { children: [(0, jsx_runtime_1.jsxs)(BettingLineCell, Object.assign({ id: overBetSlipInfo.betCellId, betHandler: getBetHandler(overBetSlipInfo, navigate, setBetSlipInfo) }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 4 }, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, Object.assign({ sx: { paddingY: "10px", fontWeight: "light", fontSize: 'default' } }, { children: ["O ", betData.gameTotal] })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ sx: { color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' } }, { children: overOdds })) }))] })), (0, jsx_runtime_1.jsxs)(BettingLineCell, Object.assign({ id: underBetSlipInfo.betCellId, betHandler: getBetHandler(underBetSlipInfo, navigate, setBetSlipInfo) }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 4 }, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, Object.assign({ sx: { paddingY: "10px", fontWeight: "light", fontSize: 'default' } }, { children: ["U ", betData.gameTotal] })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, sm: 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ sx: { color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' } }, { children: underOdds })) }))] }))] })));
};
const BettingLineCell = ({ betHandler, children, id }) => {
    const { betSlipInfo } = (0, react_1.useContext)(BetSlipProvider_1.BetSlipContext);
    (0, react_1.useEffect)(() => {
        console.log(betSlipInfo.find(info => info.betCellId === id));
    }, [betSlipInfo]);
    const onClick = () => {
        betHandler();
    };
    return ((0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ id: id, item: true, container: true, alignItems: "center", justifyContent: "center", className: betSlipInfo.find(info => info.betCellId === id) != undefined ? "bettingLine-cell-selected" : "bettingLine-cell", onClick: onClick }, { children: children })));
};
const getSportEventsByDate = (data) => {
    return data.reduce((accumlateEvents, sportEvent) => {
        const dateString = getShortDate(new Date(sportEvent.dateTime));
        if (typeof accumlateEvents[dateString] === "undefined") {
            accumlateEvents[dateString] = [];
        }
        accumlateEvents[dateString].push(sportEvent);
        return accumlateEvents;
    }, {});
};
const getShortDate = (date) => {
    const dateOptions = {
        weekday: "short",
        month: "short",
        day: "numeric"
    };
    return date.toLocaleDateString(undefined, dateOptions).replace(",", "");
};
const getAMPMTime = (dateTime) => {
    const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true
    };
    return dateTime.toLocaleString(undefined, timeOptions);
};
const getFavUnderdogBetSlipInfo = (bettingLineData, sportEvent) => {
    const betSlipInfo = {
        betId: bettingLineData.id,
        matchSummary: sportEvent.travelTeam.name + " @ " + sportEvent.homeTeam.name,
        spread: bettingLineData.spread ? (0, betUtils_1.convertOddsToString)(bettingLineData.spread) : undefined
    };
    return [
        Object.assign(Object.assign({}, betSlipInfo), { betCellId: (0, betUtils_1.getBetCellId)(bettingLineData, BettingLine_1.BetPosition.Favorite), odds: (0, betUtils_1.convertOddsToString)(bettingLineData.favoriteOdds), chosenTeam: sportEvent.isHomeTeamFavorite ? sportEvent.homeTeam : sportEvent.travelTeam }),
        Object.assign(Object.assign({}, betSlipInfo), { betCellId: (0, betUtils_1.getBetCellId)(bettingLineData, BettingLine_1.BetPosition.Underdog), odds: (0, betUtils_1.convertOddsToString)(bettingLineData.underdogOdds), chosenTeam: sportEvent.isHomeTeamFavorite ? sportEvent.travelTeam : sportEvent.homeTeam })
    ];
};
const getOverUnderBetSlipInfo = (bettingLineData, sportEvent) => {
    const betSlipInfo = {
        betId: bettingLineData.id,
        betType: bettingLineData.betType,
        matchSummary: sportEvent.travelTeam.name + " @ " + sportEvent.homeTeam.name,
        gameTotal: bettingLineData.gameTotal
    };
    return [
        Object.assign(Object.assign({}, betSlipInfo), { betCellId: (0, betUtils_1.getBetCellId)(bettingLineData, BettingLine_1.BetPosition.Over), odds: (0, betUtils_1.convertOddsToString)(bettingLineData.overOdds) }),
        Object.assign(Object.assign({}, betSlipInfo), { betCellId: (0, betUtils_1.getBetCellId)(bettingLineData, BettingLine_1.BetPosition.Under), odds: (0, betUtils_1.convertOddsToString)(bettingLineData.underOdds) })
    ];
};
const getBetHandler = (betSlipInfo, navigate, setBetSlipInfo) => {
    return () => {
        setBetSlipInfo((infos) => {
            const filteredInfos = infos.filter(info => info.betCellId != betSlipInfo.betCellId);
            if (filteredInfos.length != infos.length) { // If removed previously selected element, return now
                return filteredInfos;
            }
            return [...infos, betSlipInfo];
        });
        navigate("betSlip");
    };
};

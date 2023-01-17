"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBetCellIdInfo = exports.getOverOrUnder = exports.getFavoriteOrUnderdog = exports.getBetCellId = exports.convertOddsToString = exports.getOddsData = void 0;
const BettingLine_1 = require("../models/BettingLine");
const getOddsData = (betData) => {
    let favoriteSpread = "";
    let underdogSpread = "";
    let favoriteOdds = "";
    let underdogOdds = "";
    let overOdds = "";
    let underOdds = "";
    if (betData.betType === BettingLine_1.BetType.MoneyLine || betData.betType === BettingLine_1.BetType.Spread) {
        favoriteOdds = (0, exports.convertOddsToString)(betData.favoriteOdds);
        underdogOdds = (0, exports.convertOddsToString)(betData.underdogOdds);
    }
    if (betData.betType === BettingLine_1.BetType.Spread) {
        favoriteSpread = String(-betData.spread);
        underdogSpread = "+" + String(betData.spread);
    }
    if (betData.betType === BettingLine_1.BetType.GameTotal) {
        overOdds = (0, exports.convertOddsToString)(betData.overOdds);
        underOdds = (0, exports.convertOddsToString)(betData.underOdds);
    }
    return {
        favoriteSpread: favoriteSpread,
        underdogSpread: underdogSpread,
        favoriteOdds: favoriteOdds,
        underdogOdds: underdogOdds,
        overOdds: overOdds,
        underOdds: underOdds
    };
};
exports.getOddsData = getOddsData;
const convertOddsToString = (odds) => {
    return odds > 0 ? "+" + String(odds) : String(odds);
};
exports.convertOddsToString = convertOddsToString;
const getBetCellId = (bettingLineData, betPosition) => {
    return bettingLineData.id + "~" + bettingLineData.betType + "~" + betPosition;
};
exports.getBetCellId = getBetCellId;
const getFavoriteOrUnderdog = (info) => {
    const cellInfo = (0, exports.getBetCellIdInfo)(info.betCellId);
    if (cellInfo.betPosition === BettingLine_1.BetPosition.Favorite) {
        return true;
    }
    else if (cellInfo.betPosition === BettingLine_1.BetPosition.Underdog) {
        return false;
    }
    else {
        return undefined;
    }
};
exports.getFavoriteOrUnderdog = getFavoriteOrUnderdog;
const getOverOrUnder = (info) => {
    const cellInfo = (0, exports.getBetCellIdInfo)(info.betCellId);
    if (cellInfo.betPosition === BettingLine_1.BetPosition.Over) {
        return true;
    }
    else if (cellInfo.betPosition === BettingLine_1.BetPosition.Under) {
        return false;
    }
    else {
        return undefined;
    }
};
exports.getOverOrUnder = getOverOrUnder;
const getBetCellIdInfo = (compositeId) => {
    const pieces = compositeId.split("~");
    return {
        id: Number(pieces[0]),
        betType: Number(pieces[1]),
        betPosition: Number(pieces[2])
    };
};
exports.getBetCellIdInfo = getBetCellIdInfo;

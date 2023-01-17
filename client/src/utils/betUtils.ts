import { IBetSlipInfo } from "../BetSlipProvider";
import { BetType, BetPosition, IBettingLine } from "../models/BettingLine";

interface IOddsData {
    favoriteSpread: string;
    underdogSpread: string;
    favoriteOdds: string;
    underdogOdds: string;
    overOdds: string;
    underOdds: string;
}

export const getOddsData = (betData: IBettingLine): IOddsData => {
    let favoriteSpread: string = "";
    let underdogSpread: string = "";
    let favoriteOdds: string = "";
    let underdogOdds: string = "";
    let overOdds: string = "";
    let underOdds: string = "";

    if (betData.betType === BetType.MoneyLine || betData.betType === BetType.Spread) {
        favoriteOdds = convertOddsToString(betData.favoriteOdds);
        underdogOdds = convertOddsToString(betData.underdogOdds);
    }

    if (betData.betType === BetType.Spread) {
        favoriteSpread = String(-betData.spread);
        underdogSpread = "+" + String(betData.spread);
    }

    if (betData.betType === BetType.GameTotal) {
        overOdds = convertOddsToString(betData.overOdds);
        underOdds = convertOddsToString(betData.underOdds);
    }

    return {
        favoriteSpread: favoriteSpread,
        underdogSpread: underdogSpread,
        favoriteOdds: favoriteOdds,
        underdogOdds: underdogOdds,
        overOdds: overOdds,
        underOdds: underOdds
    }
}

export const convertOddsToString = (odds: number) => {
    return odds > 0 ? "+" + String(odds) : String(odds);
}
export const getBetCellId = (bettingLineData: IBettingLine, betPosition: BetPosition) => {
    return bettingLineData.id + "~" + bettingLineData.betType + "~" + betPosition;
}

export const getFavoriteOrUnderdog = (info: IBetSlipInfo) => {
    const cellInfo = getBetCellIdInfo(info.betCellId);
    if (cellInfo.betPosition === BetPosition.Favorite) {
        return true;
    }
    else if (cellInfo.betPosition === BetPosition.Underdog) {
        return false;
    }
    else {
        return undefined;
    }
}

export const getOverOrUnder = (info: IBetSlipInfo) => {
    const cellInfo = getBetCellIdInfo(info.betCellId);
    if (cellInfo.betPosition === BetPosition.Over) {
        return true;
    }
    else if (cellInfo.betPosition === BetPosition.Under) {
        return false;
    }
    else {
        return undefined;
    }
}

export const getBetCellIdInfo = (compositeId: string) => {
    const pieces = compositeId.split("~");
    return {
        id: Number(pieces[0]),
        betType: Number(pieces[1]),
        betPosition: Number(pieces[2])
    }
}
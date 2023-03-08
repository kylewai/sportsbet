import { IBetSlipItem } from "@betting/BetSlipProvider";
import { ISportEvent } from "models/SportEvent";
import { BetType, BetPosition, IBettingLine } from "../../models/BettingLine";

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
        favoriteSpread,
        underdogSpread,
        favoriteOdds,
        underdogOdds,
        overOdds,
        underOdds
    }
}

export const convertOddsToString = (odds: number) => {
    return odds > 0 ? "+" + String(odds) : String(odds);
}
export const getBetCellId = (bettingLineData: IBettingLine, betPosition: BetPosition) => {
    return bettingLineData.id + "~" + bettingLineData.betType + "~" + betPosition;
}

export const getFavoriteOrUnderdog = (info: IBetSlipItem) => {
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

export const getOverOrUnder = (info: IBetSlipItem) => {
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

export const getSportEventsByDate = (data: ISportEvent[]) => {
    return data.reduce<{ [date: string]: ISportEvent[] }>((accumlateEvents, sportEvent) => {
        const dateString = sportEvent.dateTime.split("T")[0];
        if (typeof accumlateEvents[dateString] === "undefined") {
            accumlateEvents[dateString] = [];
        }
        accumlateEvents[dateString].push(sportEvent);
        return accumlateEvents;
    }, {});
}

//date: ISO8601 formatted date string
//returns ex. 2022-12-11 => Sun Dec 11
export const getShortDate = (date: string) => {
    let parts = date.split('-');
    var localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric"
    };
    return localDate.toLocaleDateString(undefined, dateOptions).replace(",", "");
}

export const getAMPMTime = (dateTime: Date) => {
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true
    };
    return dateTime.toLocaleString(undefined, timeOptions);
}
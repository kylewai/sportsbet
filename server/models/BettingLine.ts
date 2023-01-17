export enum BetType {
    MoneyLine = 1,
    Spread,
    GameTotal
}

export interface IBettingLine {
    id: number;
    betType: BetType;
    favoriteOdds: number;
    underdogOdds: number;
    spread: number;
    overOdds: number;
    underOdds: number;
    gameTotal?: number;
}

export const getBettingLinesByType = (bettingLines: IBettingLine[]) => {
    return bettingLines?.reduce<{ [type: number]: IBettingLine }>((map, bettingLine) => {
        map[bettingLine.betType] = bettingLine;
        return map;
    }, {});
}

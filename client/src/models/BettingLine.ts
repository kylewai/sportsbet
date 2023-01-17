export enum BetType {
    MoneyLine = 1,
    Spread,
    GameTotal
}

export enum BetPosition {
    Favorite,
    Underdog,
    Over,
    Under
}

export const betTypeToString = (betType: BetType) => {
    switch (betType) {
        case BetType.MoneyLine: return "Money Line";
        case BetType.Spread: return "Spread";
        case BetType.GameTotal: return "Game Total";
        default: return "";
    }
}

export interface IBettingLine {
    id: number;
    betType: BetType;
    favoriteOdds: number;
    underdogOdds: number;
    spread: number;
    overOdds: number;
    underOdds: number;
    gameTotal: number;
}
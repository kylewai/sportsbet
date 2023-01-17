export interface IBet {
    bettingLineId: number;
    odds: number;
    wager: number;
    favoriteOrUnderdog?: boolean;
    overOrUnder?: boolean;
    gameTotal?: number;
    spread?: number;
}
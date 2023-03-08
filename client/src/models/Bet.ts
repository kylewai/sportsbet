export interface IBet {
    bettingLineId: number;
    odds: number;
    wager: number;
    favoriteOrUnderdog?: boolean;
    overOrUnder?: boolean;
    gameTotal?: number;
    spread?: number;
}

export interface IBetFollowup {
    action: BetFollowUpAction;
    data?: { [betCellId: string]: IConfirmBetData };
}

export enum BetFollowUpAction {
    None,
    ConfirmBet
}

export interface IConfirmBetData {
    betCellId: string;
    currSpread?: number;
    currGameTotal?: number;
    currOdds?: number;
    betPlacedSpread?: number;
    betPlacedGameTotal?: number;
    betPlacedOdds?: number;
}
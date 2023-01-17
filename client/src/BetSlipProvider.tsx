import * as React from 'react';
import { useState } from 'react';
import { ITeam } from './models/Team';

export interface IBetSlipInfo {
    betId: number;
    betCellId: string;
    odds: string;
    matchSummary: string;
    wager?: number;
    chosenTeam?: ITeam;
    spread?: string;
    gameTotal?: number;
}

export interface IBetSlip {
    [betCellId: string]: IBetSlipInfo
}

export interface IBetSlipContext {
    betSlip: IBetSlip;
    setBetSlipInfo: React.Dispatch<React.SetStateAction<IBetSlip>>;
}

export const BetSlipContext = React.createContext<IBetSlipContext>({
    betSlip: {},
    setBetSlipInfo: {} as any
});

export const BetSlipProvider = (props: any) => {
    const [betSlipInfo, setBetSlipInfo] = useState<IBetSlip>({});
    return (
        <BetSlipContext.Provider value={{ betSlip: betSlipInfo, setBetSlipInfo: setBetSlipInfo }}>
            {props.children}
        </BetSlipContext.Provider>
    )
}
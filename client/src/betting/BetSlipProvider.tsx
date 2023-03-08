import * as React from 'react';
import { useState } from 'react';
import { ITeam } from '@models/Team';

export interface IBetSlipItem {
    betId: number;
    betCellId: string;
    odds: number;
    matchSummary: string;
    chosenTeam?: ITeam;
    spread?: number;
    gameTotal?: number;
}

export interface IBetSlip {
    [betCellId: string]: IBetSlipItem
}

export interface IBetSlipContext {
    betSlip: IBetSlip;
    shouldShowBetSlip: boolean;
    setShouldShowBetSlip: React.Dispatch<React.SetStateAction<boolean>>;
    setBetSlipInfo: React.Dispatch<React.SetStateAction<IBetSlip>>;
}

export const BetSlipContext = React.createContext<IBetSlipContext>({
    betSlip: {},
    shouldShowBetSlip: false,
    setShouldShowBetSlip: {} as any,
    setBetSlipInfo: {} as any
});

export const BetSlipProvider = (props: any) => {
    const [betSlip, setBetSlipInfo] = useState<IBetSlip>({});
    const [shouldShowBetSlip, setShouldShowBetSlip] = useState(false);
    return (
        <BetSlipContext.Provider value={{ betSlip: betSlip, shouldShowBetSlip: shouldShowBetSlip, setShouldShowBetSlip: setShouldShowBetSlip, setBetSlipInfo: setBetSlipInfo }}>
            {props.children}
        </BetSlipContext.Provider>
    )
}
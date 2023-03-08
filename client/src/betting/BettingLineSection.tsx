import Grid from '@mui/material/Grid';
import { ISportEvent } from "../models/SportEvent";
import { IBettingLine, BetType, BetPosition } from "../models/BettingLine";
import { Typography } from "@mui/material";
import { useContext } from 'react';
import { BetSlipContext, IBetSlip, IBetSlipItem } from './BetSlipProvider';
import { getOddsData, getBetCellId } from '@utils/betting/betUtils';
import { BettingLineCell } from '@betting/BettingLineCell';

interface IBettingLineSectionProps {
    betData?: IBettingLine;
    sportEvent: ISportEvent;
    getBetClickedHandler: (betSlipInfo: IBetSlipItem) => PlaceBetClicked;
}

export const BettingLineSection = ({ betData, sportEvent }: Pick<IBettingLineSectionProps, "betData" | "sportEvent">) => {
    const { setBetSlipInfo, setShouldShowBetSlip } = useContext(BetSlipContext);
    if (!betData) {
        return (
            <Grid item sm={6} sx={{ paddingY: "10px" }}></Grid>
        );
    }

    const getBetClickedHandler = createBetHandler(setShouldShowBetSlip, setBetSlipInfo);

    switch (betData.betType) {
        case BetType.MoneyLine:
            return <MoneyBettingLineSection
                betData={betData}
                sportEvent={sportEvent}
                getBetClickedHandler={getBetClickedHandler} />;
        case BetType.Spread:
            return <SpreadBettingLineSection
                betData={betData}
                sportEvent={sportEvent}
                getBetClickedHandler={getBetClickedHandler} />;
        case BetType.GameTotal:
            return <GameTotalBettingLineSection
                betData={betData}
                sportEvent={sportEvent}
                getBetClickedHandler={getBetClickedHandler} />;
    }
}

const MoneyBettingLineSection = ({ betData, sportEvent, getBetClickedHandler }: Required<IBettingLineSectionProps>) => {
    const isFavoriteAbove = !sportEvent.isHomeTeamFavorite;
    const { favoriteOdds, underdogOdds } = getOddsData(betData);
    const [favoriteBetSlipInfo, underdogBetSlipInfo] = getFavUnderdogBetSlipInfo(betData, sportEvent);
    const topBetHandler = getBetClickedHandler(isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo);
    const bottomBetHandler = getBetClickedHandler(!isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo);

    return (
        <Grid item container sm={2} direction="column" alignItems="center">
            <BettingLineCell
                id={isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId}
                betHandler={topBetHandler}>
                <Typography align="center" sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>
                    {isFavoriteAbove ? favoriteOdds : underdogOdds}
                </Typography>
            </BettingLineCell>
            <BettingLineCell
                id={!isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId}
                betHandler={bottomBetHandler}>
                <Typography align="center" sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>
                    {!isFavoriteAbove ? favoriteOdds : underdogOdds}
                </Typography>
            </BettingLineCell>
        </Grid>
    );
}

const SpreadBettingLineSection = ({ betData, sportEvent, getBetClickedHandler }: Required<IBettingLineSectionProps>) => {
    const isFavoriteAbove = !sportEvent.isHomeTeamFavorite;
    const { favoriteSpread, underdogSpread, favoriteOdds, underdogOdds } = getOddsData(betData);
    const [favoriteBetSlipInfo, underdogBetSlipInfo] = getFavUnderdogBetSlipInfo(betData, sportEvent);
    const topBetHandler = getBetClickedHandler(isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo);
    const bottomBetHandler = getBetClickedHandler(!isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo);

    return (
        <Grid item container sm={2} direction="column" alignItems="center">
            <BettingLineCell
                id={isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId}
                betHandler={topBetHandler}>
                <Grid item sm={3}>
                    <Typography align="center" sx={{ paddingY: "10px", fontWeight: "light", fontSize: 'default' }}>
                        {isFavoriteAbove ? favoriteSpread : underdogSpread}
                    </Typography>
                </Grid>
                <Grid item sm={3}>
                    <Typography align="center" sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>
                        {isFavoriteAbove ? favoriteOdds : underdogOdds}
                    </Typography>
                </Grid>
            </BettingLineCell>
            <BettingLineCell
                id={!isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId}
                betHandler={bottomBetHandler}>
                <Grid item sm={3}>
                    <Typography align="center" sx={{ paddingY: "10px", fontWeight: "light", fontSize: 'default' }}>
                        {!isFavoriteAbove ? favoriteSpread : underdogSpread}
                    </Typography>
                </Grid>
                <Grid item sm={3}>
                    <Typography align="center" sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>
                        {!isFavoriteAbove ? favoriteOdds : underdogOdds}
                    </Typography>
                </Grid>
            </BettingLineCell>
        </Grid>
    );
}

const GameTotalBettingLineSection = ({ betData, sportEvent, getBetClickedHandler }: Required<IBettingLineSectionProps>) => {
    const { overOdds, underOdds } = getOddsData(betData);
    const [overBetSlipInfo, underBetSlipInfo] = getOverUnderBetSlipInfo(betData, sportEvent);
    const topBetHandler = getBetClickedHandler(overBetSlipInfo);
    const bottomBetHandler = getBetClickedHandler(underBetSlipInfo);

    return (
        <Grid item container direction="column" sm={2} alignItems="center">
            <BettingLineCell
                id={overBetSlipInfo.betCellId}
                betHandler={topBetHandler}>
                <Grid item sm={4}>
                    <Typography sx={{ paddingY: "10px", fontWeight: "light", fontSize: 'default' }}>O {betData.gameTotal}</Typography>
                </Grid>
                <Grid item sm={3}>
                    <Typography sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>{overOdds}</Typography>
                </Grid>
            </BettingLineCell>
            <BettingLineCell
                id={underBetSlipInfo.betCellId}
                betHandler={bottomBetHandler}>
                <Grid item sm={4}>
                    <Typography sx={{ paddingY: "10px", fontWeight: "light", fontSize: 'default' }}>U {betData.gameTotal}</Typography>
                </Grid>
                <Grid item sm={3}>
                    <Typography sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>{underOdds}</Typography>
                </Grid>
            </BettingLineCell>
        </Grid>
    );
}

type PlaceBetClicked = () => void;

const createBetHandler = (
    setShouldShowBetSlip: React.Dispatch<React.SetStateAction<boolean>>,
    setBetSlipInfo: React.Dispatch<React.SetStateAction<IBetSlip>>) => {

    return (betSlipInfo: IBetSlipItem): PlaceBetClicked => () => {
        setBetSlipInfo((infos) => {
            const newBetCellId = betSlipInfo.betCellId;
            const newInfos = { ...infos };
            delete newInfos[newBetCellId];
            if (Object.keys(infos).length !== Object.keys(newInfos).length) { // If removed previously selected element, return now
                return newInfos;
            }
            newInfos[newBetCellId] = betSlipInfo;
            return newInfos;
        });
        setShouldShowBetSlip(true);
    }
}

const getFavUnderdogBetSlipInfo = (bettingLineData: IBettingLine, sportEvent: ISportEvent): IBetSlipItem[] => {
    const betSlipInfo = {
        betId: bettingLineData.id,
        matchSummary: sportEvent.travelTeam.name + " @ " + sportEvent.homeTeam.name,
        spread: bettingLineData.spread ? bettingLineData.spread : undefined
    }

    return [
        {
            ...betSlipInfo,
            betCellId: getBetCellId(bettingLineData, BetPosition.Favorite),
            odds: bettingLineData.favoriteOdds,
            chosenTeam: sportEvent.isHomeTeamFavorite ? sportEvent.homeTeam : sportEvent.travelTeam,
        },
        {
            ...betSlipInfo,
            betCellId: getBetCellId(bettingLineData, BetPosition.Underdog),
            odds: bettingLineData.underdogOdds,
            chosenTeam: sportEvent.isHomeTeamFavorite ? sportEvent.travelTeam : sportEvent.homeTeam
        }
    ];
}

const getOverUnderBetSlipInfo = (bettingLineData: IBettingLine, sportEvent: ISportEvent): IBetSlipItem[] => {
    const betSlipInfo = {
        betId: bettingLineData.id,
        betType: bettingLineData.betType,
        matchSummary: sportEvent.travelTeam.name + " @ " + sportEvent.homeTeam.name,
        gameTotal: bettingLineData.gameTotal
    }

    return [
        {
            ...betSlipInfo,
            betCellId: getBetCellId(bettingLineData, BetPosition.Over),
            odds: bettingLineData.overOdds,
        },
        {
            ...betSlipInfo,
            betCellId: getBetCellId(bettingLineData, BetPosition.Under),
            odds: bettingLineData.underOdds
        }
    ];
}
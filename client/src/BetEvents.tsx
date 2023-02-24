import Grid from '@mui/material/Grid';
import { NormalIcon, IconType } from "./utils/Icons";
import useSWR from "swr";
import { ISportEvent } from "./models/SportEvent";
import { NavigateFunction, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { IBettingLine, BetType, BetPosition } from "./models/BettingLine";
import { apiFetcher } from "./utils/DataFetcher";
import { Typography } from "@mui/material";
import "./App.css";
import { useContext, useEffect, useState } from 'react';
import { BetSlipContext, BetSlipProvider, IBetSlip, IBetSlipInfo } from './BetSlipProvider';
import { SportEventContext, SportEventProvider } from './SportEventProvider';
import { convertOddsToString, getBetCellId, getOddsData } from './utils/betUtils';
import { BetSlip } from './BetSlip';
import { AuthedComponent } from './auth/AuthedComponent';

export interface IBettingEventsLocationProps {
	isSuccessfulBet: boolean;
}

const AuthedBetSlip = () => {
	const { setBetSlipInfo, shouldShowBetSlip, setShouldShowBetSlip } = useContext(BetSlipContext);
	const onAuthCancelled = () => {
		setBetSlipInfo({});
		setShouldShowBetSlip(false);
	}
	return (
		shouldShowBetSlip ?
			<AuthedComponent onAuthCancelled={onAuthCancelled}>
				<BetSlip />
			</AuthedComponent>
			:
			null
	);
}

export const BettingEventsList = () => {
	const { leagueId } = useParams();
	const location = useLocation();
	const { data, error } = useSWR<ISportEvent[], Error>("/api/leagues/" + leagueId + "/events", apiFetcher, { refreshInterval: 1000 });

	if (error) {
		console.log(error.message);
		return <div>failed to load</div>
	}

	if (!data) return <div>loading...</div> //TODO: Better loading UI

	const eventsByDate = getSportEventsByDate(data);

	return (
		<BetSlipProvider>
			<Grid container rowSpacing={0} alignItems="center" style={{ userSelect: "none" }}>
				{Object.keys(eventsByDate).sort().reverse().map((dateString, index) => (

					<Grid container key={index}>
						<EventHeader date={getShortDate(dateString)} />
						<Grid item container >
							{eventsByDate[dateString].map((sportEvent, index) => <SportEventOverview key={index} sportEvent={sportEvent} />)}
						</Grid>
					</Grid>
				))}
			</Grid>
			{<AuthedBetSlip />}
			{/* <Outlet context={location.pathname} /> */}
		</BetSlipProvider>
	)
}

interface ISportEventOverviewProps {
	sportEvent: ISportEvent
}

const SportEventOverview = ({ sportEvent }: ISportEventOverviewProps) => {
	const time = getAMPMTime(new Date(sportEvent.dateTime));
	return (
		<SportEventProvider sportEvent={sportEvent}>
			<Grid item container className="sportEvent">
				<Grid item container sm={6} style={{ borderRight: "1px solid lightgray" }} alignItems="center">
					<Grid item sm={3}>{time}</Grid>
					<Grid item container direction="column" sm={9}>
						<Grid item>
							<div style={{ display: "inline-block", verticalAlign: "middle" }}>
								<NormalIcon iconType={IconType.Team} iconKey={sportEvent.travelTeam.id} />
							</div>
							<div style={{ display: "inline-block", verticalAlign: "middle" }}>{sportEvent.travelTeam.name}</div>
						</Grid>
						<Grid item>
							<div style={{ display: "inline-block", verticalAlign: "middle" }}>
								<NormalIcon iconType={IconType.Team} iconKey={sportEvent.homeTeam.id} />
							</div>
							<div style={{ display: "inline-block", verticalAlign: "middle" }}>{sportEvent.homeTeam.name}</div>
						</Grid>
					</Grid>
				</Grid>
				<BettingLineSection betData={sportEvent.bettingLines?.[BetType.Spread]} />
				<BettingLineSection betData={sportEvent.bettingLines?.[BetType.GameTotal]} />
				<BettingLineSection betData={sportEvent.bettingLines?.[BetType.MoneyLine]} />
			</Grid>
		</SportEventProvider>
	);
}

const EventHeader = ({ date }: { date: string }) => {
	return (
		<Grid item container columnSpacing={0}>
			<Grid item sm={6} style={{ background: "black", color: "white" }}>
				{date}
			</Grid>
			<Grid item sm={2} style={{ background: "black", color: "white" }}>
				<Typography align="center">
					Spread
				</Typography>
			</Grid>
			<Grid item sm={2} style={{ background: "black", color: "white" }}>
				<Typography align="center">
					Total
				</Typography>
			</Grid>
			<Grid item sm={2} style={{ background: "black", color: "white" }}>
				<Typography align="center">
					Money Line
				</Typography>
			</Grid>
		</Grid>
	);
}

interface IBettingLineSectionProps {
	betData?: IBettingLine;
	isFavoriteAbove?: boolean;
}

const BettingLineSection = ({ betData }: IBettingLineSectionProps) => {
	const sportEvent = useContext(SportEventContext);
	const isFavoriteAbove = !sportEvent.isHomeTeamFavorite;
	if (!betData) {
		return (
			<Grid item sm={6} sx={{ paddingY: "10px" }}>
			</Grid>
		);
	}

	switch (betData.betType) {
		case BetType.MoneyLine: return <MoneyBettingLineSection betData={betData} isFavoriteAbove={isFavoriteAbove} />;
		case BetType.Spread: return <SpreadBettingLineSection betData={betData} isFavoriteAbove={isFavoriteAbove} />;
		case BetType.GameTotal: return <GameTotalBettingLineSection betData={betData} isFavoriteAbove={isFavoriteAbove} />;
	}
}

const MoneyBettingLineSection = ({ betData, isFavoriteAbove }: IBettingLineSectionProps) => {
	const navigate = useNavigate();
	const { setBetSlipInfo, setShouldShowBetSlip } = useContext(BetSlipContext);
	const sportEvent = useContext(SportEventContext);
	const location = useLocation();

	if (!betData) {
		return null;
	}

	const { favoriteOdds, underdogOdds } = getOddsData(betData);
	const [favoriteBetSlipInfo, underdogBetSlipInfo] = getFavUnderdogBetSlipInfo(betData, sportEvent);

	return (
		<Grid item container sm={2} direction="column" alignItems="center">
			<BettingLineCell id={isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId} betHandler={getBetHandler(isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, setShouldShowBetSlip, setBetSlipInfo)}>
				<Typography align="center" sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>
					{isFavoriteAbove ? favoriteOdds : underdogOdds}
				</Typography>
			</BettingLineCell>
			<BettingLineCell id={!isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId} betHandler={getBetHandler(!isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, setShouldShowBetSlip, setBetSlipInfo)}>
				<Typography align="center" sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>
					{!isFavoriteAbove ? favoriteOdds : underdogOdds}
				</Typography>
			</BettingLineCell>
		</Grid>
	);
}

const SpreadBettingLineSection = ({ betData, isFavoriteAbove }: IBettingLineSectionProps) => {
	const navigate = useNavigate();
	const { setBetSlipInfo, setShouldShowBetSlip } = useContext(BetSlipContext);
	const sportEvent = useContext(SportEventContext);
	const location = useLocation();

	if (!betData) {
		return null;
	}

	const { favoriteSpread, underdogSpread, favoriteOdds, underdogOdds } = getOddsData(betData);
	const [favoriteBetSlipInfo, underdogBetSlipInfo] = getFavUnderdogBetSlipInfo(betData, sportEvent);

	return (
		<Grid item container sm={2} direction="column" alignItems="center">
			<BettingLineCell id={isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId} betHandler={getBetHandler(isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, setShouldShowBetSlip, setBetSlipInfo)}>
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
			<BettingLineCell id={!isFavoriteAbove ? favoriteBetSlipInfo.betCellId : underdogBetSlipInfo.betCellId} betHandler={getBetHandler(!isFavoriteAbove ? favoriteBetSlipInfo : underdogBetSlipInfo, setShouldShowBetSlip, setBetSlipInfo)}>
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

const GameTotalBettingLineSection = ({ betData }: IBettingLineSectionProps) => {
	const navigate = useNavigate();
	const { setBetSlipInfo, setShouldShowBetSlip } = useContext(BetSlipContext);
	const sportEvent = useContext(SportEventContext);
	const location = useLocation();

	if (!betData) {
		return null;
	}

	const { overOdds, underOdds } = getOddsData(betData);
	const [overBetSlipInfo, underBetSlipInfo] = getOverUnderBetSlipInfo(betData, sportEvent);

	return (
		<Grid item container direction="column" sm={2} alignItems="center">
			<BettingLineCell id={overBetSlipInfo.betCellId} betHandler={getBetHandler(overBetSlipInfo, setShouldShowBetSlip, setBetSlipInfo)}>
				<Grid item sm={4}>
					<Typography sx={{ paddingY: "10px", fontWeight: "light", fontSize: 'default' }}>O {betData.gameTotal}</Typography>
				</Grid>
				<Grid item sm={3}>
					<Typography sx={{ color: "#5c916e", paddingY: "10px", fontWeight: "bold", fontSize: 'default' }}>{overOdds}</Typography>
				</Grid>
			</BettingLineCell>
			<BettingLineCell id={underBetSlipInfo.betCellId} betHandler={getBetHandler(underBetSlipInfo, setShouldShowBetSlip, setBetSlipInfo)}>
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

interface IBettingLineCellProps {
	betHandler: () => void;
	children: React.ReactNode;
	id: string;
}

const BettingLineCell = ({ betHandler, children, id }: IBettingLineCellProps) => {
	const { betSlip: betSlipInfo } = useContext(BetSlipContext);

	const onClick = () => {
		betHandler();
	}
	return (
		<Grid id={id} item container alignItems="center" justifyContent="center"
			className={betSlipInfo[id] != undefined ? "bettingLine-cell-selected" : "bettingLine-cell"} onClick={onClick}>
			{children}
		</Grid>
	)
}

const getSportEventsByDate = (data: ISportEvent[]) => {
	return data.reduce<{ [date: string]: ISportEvent[] }>((accumlateEvents, sportEvent) => {
		const dateString = sportEvent.dateTime.split("T")[0];
		if (typeof accumlateEvents[dateString] === "undefined") {
			accumlateEvents[dateString] = [];
		}
		accumlateEvents[dateString].push(sportEvent);
		return accumlateEvents;
	}, {});
}

const getShortDate = (date: string) => {
	let parts = date.split('-');
	var localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
	console.log(localDate.toDateString());
	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: "short",
		month: "short",
		day: "numeric"
	};
	return localDate.toLocaleDateString(undefined, dateOptions).replace(",", "");
}

const getAMPMTime = (dateTime: Date) => {
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	};
	return dateTime.toLocaleString(undefined, timeOptions);
}

const getFavUnderdogBetSlipInfo = (bettingLineData: IBettingLine, sportEvent: ISportEvent): IBetSlipInfo[] => {
	const betSlipInfo = {
		betId: bettingLineData.id,
		matchSummary: sportEvent.travelTeam.name + " @ " + sportEvent.homeTeam.name,
		spread: bettingLineData.spread ? convertOddsToString(bettingLineData.spread) : undefined
	}

	return [
		{
			...betSlipInfo,
			betCellId: getBetCellId(bettingLineData, BetPosition.Favorite),
			odds: convertOddsToString(bettingLineData.favoriteOdds),
			chosenTeam: sportEvent.isHomeTeamFavorite ? sportEvent.homeTeam : sportEvent.travelTeam,
		},
		{
			...betSlipInfo,
			betCellId: getBetCellId(bettingLineData, BetPosition.Underdog),
			odds: convertOddsToString(bettingLineData.underdogOdds),
			chosenTeam: sportEvent.isHomeTeamFavorite ? sportEvent.travelTeam : sportEvent.homeTeam
		}
	];
}

const getOverUnderBetSlipInfo = (bettingLineData: IBettingLine, sportEvent: ISportEvent): IBetSlipInfo[] => {
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
			odds: convertOddsToString(bettingLineData.overOdds),
		},
		{
			...betSlipInfo,
			betCellId: getBetCellId(bettingLineData, BetPosition.Under),
			odds: convertOddsToString(bettingLineData.underOdds)
		}
	];
}

const getBetHandler = (
	betSlipInfo: IBetSlipInfo,
	setShouldShowBetSlip: React.Dispatch<React.SetStateAction<boolean>>,
	setBetSlipInfo: React.Dispatch<React.SetStateAction<IBetSlip>>) => {

	return () => {
		setBetSlipInfo((infos) => {
			const newBetCellId = betSlipInfo.betCellId;
			const newInfos = { ...infos };
			delete newInfos[newBetCellId];
			if (Object.keys(infos).length != Object.keys(newInfos).length) { // If removed previously selected element, return now
				return newInfos;
			}
			newInfos[newBetCellId] = betSlipInfo;
			return newInfos;
		});
		setShouldShowBetSlip(true);
		// navigate("betSlip", {
		// 	state: previousRoute
		// });
	}
}
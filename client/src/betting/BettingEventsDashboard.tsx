import Grid from '@mui/material/Grid';
import { NormalIcon, IconType } from "@utils/Icons";
import useSWR from "swr";
import { ISportEvent } from "../models/SportEvent";
import { useParams } from "react-router-dom";
import { BetType } from "../models/BettingLine";
import { apiFetcher } from "@utils/DataFetcher";
import { Typography } from "@mui/material";
import { useContext } from 'react';
import { BetSlipContext, BetSlipProvider } from './BetSlipProvider';
import { getAMPMTime, getShortDate, getSportEventsByDate } from '@utils/betting/betUtils';
import { BetSlip } from './BetSlip';
import { AuthedComponent } from '../auth/AuthedComponent';
import { LEAGUE_EVENTS_LIST_URL } from '@utils/serverEndpoints';
import { BettingLineSection } from '@betting/BettingLineSection';

export const BettingEventsDashboard = () => {
	const { leagueId } = useParams();
	const { data, error } = useSWR<ISportEvent[], Error>(LEAGUE_EVENTS_LIST_URL(leagueId), apiFetcher, { refreshInterval: 60000 });

	if (error) {
		console.log(error.message);
		return <div>failed to load</div>
	}

	if (!data) {
		return <div>loading...</div> //TODO: Better loading UI
	}

	const eventsByDate = getSportEventsByDate(data);

	return (
		<BetSlipProvider>
			<Grid container rowSpacing={0} alignItems="center" style={{ userSelect: "none" }}>
				<BettingEventsList eventsByDate={eventsByDate} />
			</Grid>
			<AuthedBetSlip />
		</BetSlipProvider>
	)
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

interface IBettingEventsListProps {
	eventsByDate: { [date: string]: ISportEvent[] };
}

const BettingEventsList = ({ eventsByDate }: IBettingEventsListProps) => {
	return (
		<>
			{Object.keys(eventsByDate).sort().reverse().map((dateString, index) => (

				<Grid container key={index}>
					<EventDateHeader date={getShortDate(dateString)} />
					<Grid item container >
						{eventsByDate[dateString].map((sportEvent, index) => <EventBettingLineSummary key={index} sportEvent={sportEvent} />)}
					</Grid>
				</Grid>
			))}
		</>
	);
}

interface IEventBettingLineSummaryProps {
	sportEvent: ISportEvent
}

const EventBettingLineSummary = ({ sportEvent }: IEventBettingLineSummaryProps) => {
	return (
		<Grid item container className="sportEvent">
			<EventInfo sportEvent={sportEvent} />
			<BettingLineSection betData={sportEvent.bettingLines?.[BetType.Spread]} sportEvent={sportEvent} />
			<BettingLineSection betData={sportEvent.bettingLines?.[BetType.GameTotal]} sportEvent={sportEvent} />
			<BettingLineSection betData={sportEvent.bettingLines?.[BetType.MoneyLine]} sportEvent={sportEvent} />
		</Grid>
	);
}

interface IEventInfoProps {
	sportEvent: ISportEvent
}

const EventInfo = ({ sportEvent }: IEventInfoProps) => {
	const time = getAMPMTime(new Date(sportEvent.dateTime));
	return (
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
	)
}

const EventDateHeader = ({ date }: { date: string }) => {
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
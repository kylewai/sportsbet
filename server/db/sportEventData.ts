import * as bettingLineService from "../services/bettingLineService";
import { Pool } from "pg";
import { ISportEvent } from "../models/SportEvent";
import { IBettingLine, getBettingLinesByType } from "../models/BettingLine";
import { knexPg } from "../dbConnection";

export const getSportEvents = async (sportEventId: number): Promise<ISportEvent[]> => {
    return knexPg("sport_event")
        .where("sport_event.league_id_fkey", "=", sportEventId)
        .innerJoin({ travel_team: "team" }, "sport_event.travel_team_id_fkey", "=", "travel_team.id")
        .innerJoin({ home_team: "team" }, "sport_event.home_team_id_fkey", "=", "home_team.id")
        .innerJoin("city", "sport_event.city_id_fkey", "=", "city.id")
        .select({
            id: "sport_event.id",
            homeTeamId: "home_team_id_fkey",
            travelTeamId: "travel_team_id_fkey",
            isHomeTeamFavorite: "is_home_team_favorite",
            dateTime: "dt_tm",
            leagueId: "league_id_fkey",
            cityId: "sport_event.city_id_fkey",
            travelTeamName: "travel_team.name",
            homeTeamName: "home_team.name",
            cityName: "city.name"
        })
        .then(toSportEventsResponseFormat);
}

const toSportEventsResponseFormat = (rows: any[]) => {
    return Promise.all(
        rows.map(async (row) => {
            const bettingLines = await bettingLineService.getBettingLines(row.id);
            row.homeTeam = {
                name: row.homeTeamName,
                id: row.homeTeamId
            };
            row.travelTeam = {
                name: row.travelTeamName,
                id: row.travelTeamId
            };
            row.city = {
                name: row.cityName,
                id: row.cityId
            }
            delete row.homeTeamName;
            delete row.homeTeamId;
            delete row.travelTeamName;
            delete row.travelTeamId;
            delete row.cityName;
            delete row.cityId;
            delete row.favoriteTeamId;
            row.bettingLines = getBettingLinesByType(bettingLines);
            return row;
        })
    );
}
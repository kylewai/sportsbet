"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSportEvents = void 0;
const bettingLineService = __importStar(require("./bettingLineData"));
const BettingLine_1 = require("../models/BettingLine");
const dbConnection_1 = require("../dbConnection");
const getSportEvents = async (sportEventId) => {
    return (0, dbConnection_1.knexPg)("sport_event")
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
};
exports.getSportEvents = getSportEvents;
const toSportEventsResponseFormat = (rows) => {
    return Promise.all(rows.map(async (row) => {
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
        };
        delete row.homeTeamName;
        delete row.homeTeamId;
        delete row.travelTeamName;
        delete row.travelTeamId;
        delete row.cityName;
        delete row.cityId;
        delete row.favoriteTeamId;
        row.bettingLines = (0, BettingLine_1.getBettingLinesByType)(bettingLines);
        return row;
    }));
};

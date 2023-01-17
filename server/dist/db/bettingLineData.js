"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBettingLines = void 0;
const dbConnection_1 = require("../dbConnection");
const getBettingLines = async (sportEventId) => {
    return (0, dbConnection_1.knexPg)("betting_line")
        .where("sport_event_id_fkey", "=", sportEventId)
        .select({
        id: "id",
        betType: "bet_type",
        gameTotal: "game_total",
        spread: "spread",
        favoriteOdds: "favorite_odds",
        underdogOdds: "underdog_odds",
        overOdds: "over_odds",
        underOdds: "under_odds"
    }).then();
};
exports.getBettingLines = getBettingLines;

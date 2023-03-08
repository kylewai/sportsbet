import { knexPg } from "../dbConnection";
import { IBettingLine } from "../models/BettingLine";

export const getBettingLines = async (sportEventId: number): Promise<IBettingLine[]> => {
    return knexPg("betting_line")
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
}

export const getBettingLine = async (bettingLineId: number): Promise<IBettingLine[]> => {
    return knexPg("betting_line")
        .where("id", "=", bettingLineId)
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
}
import { knexPg } from "../../dbConnection";
import { ITeam } from "../../models/Team";

export function createSportEvents() {
    knexPg("team")
        .select("id", "name", { cityId: "city_id_fkey" }, "wins", "losses", "ties")
        .then(data => generateEvents(data, 1));
}

function generateEvents(data: ITeam[], numEvents: number) {
    let homeTeam: ITeam;
    let travelTeam: ITeam;
    let eventCityId: number;
    let isHomeTeamFavorite: boolean;
    const leagueId = 1;
    const dateTime = new Date("25 December 2022 12:00 CST");
    for (let i = 0; i < numEvents; i++) {
        homeTeam = data.splice(getRandomIntFromRange(0, data.length), 1)[0]; //get random team as home team
        travelTeam = data.splice(getRandomIntFromRange(0, data.length), 1)[0]; //get random team as travel team
        eventCityId = homeTeam.cityId;
        isHomeTeamFavorite = generateIsHomeTeamFavorite(homeTeam, travelTeam);
        console.log({
            isHomeTeamFavorite: isHomeTeamFavorite,
            homeTeam: homeTeam.name,
            travelTeam: travelTeam.name,
            cityId: eventCityId
        });
        knexPg("sport_event")
            .insert(
                {
                    home_team_id_fkey: homeTeam.id,
                    travel_team_id_fkey: travelTeam.id,
                    dt_tm: dateTime,
                    league_id_fkey: leagueId,
                    city_id_fkey: eventCityId,
                    is_home_team_favorite: isHomeTeamFavorite
                },
                ["id"]
            ).then((insertedRows) => insertedRows.forEach((row) => {
                generateBettingLines(row.id, homeTeam, travelTeam, isHomeTeamFavorite);
            }));

        // generateBettingLines(1, homeTeam, travelTeam, isHomeTeamFavorite);


    }
}

const generateIsHomeTeamFavorite = (homeTeam: ITeam, travelTeam: ITeam) => {
    if (homeTeam.wins >= travelTeam.wins) {
        return true;
    }
    else if (homeTeam.wins >= travelTeam.wins - 2) {
        return getRandomIntFromRange(0, 1) == 1;
    }
    else {
        return false;
    }
}

createSportEvents();

//Inclusive of max
function getRandomIntFromRange(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomMultipleFromRange(min: number, max: number, multiple: number): number {
    if (multiple < 0) throw new Error("Cannot pass negative multiple to random generator");
    return multiple * getRandomIntFromRange(0, ((max - min) / multiple)) + min;
}


export function generateBettingLines(
    sportEventId: number,
    homeTeam: ITeam,
    travelTeam: ITeam,
    isHomeTeamFavorite: boolean) {

    const winDifference = Math.abs(homeTeam.wins - travelTeam.wins);
    const moneyLine = createMoneyLine(winDifference);
    const spreadLine = createSpreadLine(winDifference);
    const gameTotalLine = createGameTotalLine();

    console.log({
        sport_event_id_fkey: sportEventId,
        bet_type: 1,
        favorite_odds: moneyLine.favoriteOdds,
        underdog_odds: moneyLine.underdogOdds
    },
        {
            sport_event_id_fkey: sportEventId,
            bet_type: 2,
            spread: spreadLine.spread,
            favorite_odds: spreadLine.favoriteSpreadOdds,
            underdog_odds: spreadLine.underdogSpreadOdds,
        },
        {
            sport_event_id_fkey: sportEventId,
            bet_type: 3,
            game_total: gameTotalLine.gameTotal,
            over_odds: gameTotalLine.overOdds,
            under_odds: gameTotalLine.underOdds
        });
    knexPg("betting_line")
        .insert(
            [
                {
                    sport_event_id_fkey: sportEventId,
                    bet_type: 1,
                    favorite_odds: moneyLine.favoriteOdds,
                    underdog_odds: moneyLine.underdogOdds
                },
                {
                    sport_event_id_fkey: sportEventId,
                    bet_type: 2,
                    spread: spreadLine.spread,
                    favorite_odds: spreadLine.favoriteSpreadOdds,
                    underdog_odds: spreadLine.underdogSpreadOdds,
                },
                {
                    sport_event_id_fkey: sportEventId,
                    bet_type: 3,
                    game_total: gameTotalLine.gameTotal,
                    over_odds: gameTotalLine.overOdds,
                    under_odds: gameTotalLine.underOdds
                }
            ]
        ).then();
}

export function createMoneyLine(winDifference: number) {
    let favoriteOdds;
    let underdogOdds;

    if (winDifference >= 4) {
        favoriteOdds = -220;
        favoriteOdds += (winDifference - 4) * -50; //Add to favorite status for each win above 4

        underdogOdds = 220;
        underdogOdds += getRandomMultipleFromRange(-40, 60, 5); //Randomly fluctuate underdog odds
    }
    else {
        favoriteOdds = -110;
        favoriteOdds += (winDifference) * -20; // Add to favorite status for each win

        underdogOdds = 110;
        underdogOdds += getRandomMultipleFromRange(-5, 85, 5); //Randomly fluctuate underdog odds
    }

    favoriteOdds += getRandomMultipleFromRange(-15, 25, 5); //Randomize favorite odds

    return {
        favoriteOdds: favoriteOdds,
        underdogOdds: underdogOdds
    };
}

export function createSpreadLine(winDifference: number) {
    let favoriteSpreadOdds = -110;
    let underdogSpreadOdds = -110;
    let spread = 1.5;

    if (winDifference > 2) {
        spread += getRandomMultipleFromRange(1, 2, 0.5);
    }
    if (winDifference > 4) {
        spread += getRandomMultipleFromRange(1, 5, 0.5);
    }

    if (getRandomIntFromRange(0, 3) == 3) {
        favoriteSpreadOdds += getRandomMultipleFromRange(-5, 5, 5);
    }

    if (getRandomIntFromRange(0, 3) == 3) {
        underdogSpreadOdds += getRandomMultipleFromRange(-5, 5, 5);
    }

    return {
        favoriteSpreadOdds: favoriteSpreadOdds,
        underdogSpreadOdds: underdogSpreadOdds,
        spread: spread
    };
}

export function createGameTotalLine() {

    return {
        gameTotal: getRandomMultipleFromRange(30, 60, 0.5),
        overOdds: -110,
        underOdds: -110
    }

}

// console.log(getRandomMultipleFromRange(-15, 15, 5));
// console.log(createSpreadLine({
//     id: 22,
//     name: 'San Francisco 49ers',
//     cityId: 23,
//     wins: 10,
//     losses: 4,
//     ties: 0
// }, {
//     id: 26,
//     name: 'Detroit Lions',
//     cityId: 26,
//     wins: 5,
//     losses: 9,
//     ties: 0
// }, true));

// console.log(createGameTotalLine());
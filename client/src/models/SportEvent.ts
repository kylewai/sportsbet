import { ITeam } from "./Team";
import { ICity } from "./City";
import { IBettingLine } from "./BettingLine";

export interface ISportEvent {
    id: number;
    dateTime: string; //ISO8601
    homeTeam: ITeam;
    travelTeam: ITeam;
    leagueId: number;
    city: ICity;
    bettingLines?: { [type: number]: IBettingLine };
    isHomeTeamFavorite: boolean;
}
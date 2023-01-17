import { ITeam } from "./Team";
import { ICity } from "./City";
import { IBettingLine } from "./BettingLine";

export interface ISportEvent {
    id: number;
    dateTime: string;
    leagueId: number;
    homeTeam: ITeam;
    travelTeam: ITeam;
    city: ICity;
    bettingLines?: { [type: number]: IBettingLine };
    isHomeTeamFavorite: boolean;
}
export const SIGN_IN_URL = "/api/users/login";
export const REGISTER_URL = "/api/users/register";
export const LEAGUE_EVENTS_LIST_URL = (leagueId?: string) => {
    if (!leagueId) {
        throw new Error("Empty league id");
    }
    return `/api/leagues/${leagueId}/events`;
}
export const PLACE_BET_URL = "/api/users/placebet";
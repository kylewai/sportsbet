import { ISportEvent } from "./models/SportEvent";
import * as React from "react";

export const SportEventContext = React.createContext<ISportEvent>({
    id: 1,
    dateTime: "",
    homeTeam: {
        name: "",
        id: 1
    },
    travelTeam: {
        name: "",
        id: 1
    },
    leagueId: 1,
    city: {
        id: 1,
        name: ""
    },
    bettingLines: undefined,
    isHomeTeamFavorite: true
});

interface ISportEventProviderProps {
    sportEvent: ISportEvent;
    children: React.ReactNode;
}

export const SportEventProvider = ({ sportEvent, children }: ISportEventProviderProps) => {
    return (
        <SportEventContext.Provider value={sportEvent}>
            {children}
        </SportEventContext.Provider>
    )
}
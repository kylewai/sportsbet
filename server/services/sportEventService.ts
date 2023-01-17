import { Pool } from "pg";
import { ISportEvent } from "../models/SportEvent";
import * as sportEventData from "../db/sportEventData";

export const getSportEvents = async (sportEventId: number): Promise<ISportEvent[] | undefined> => {
    return sportEventData.getSportEvents(sportEventId);
}
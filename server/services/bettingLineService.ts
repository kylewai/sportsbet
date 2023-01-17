import { Pool } from "pg";
import { IBettingLine } from "../models/BettingLine";
import * as bettingLineData from "../db/bettingLineData";

export const getBettingLines = async (pool: Pool, sportEventId: number): Promise<IBettingLine[] | undefined> => {
    return bettingLineData.getBettingLines(sportEventId);
}
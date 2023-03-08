import { Pool } from "pg";
import { IBettingLine } from "../models/BettingLine";
import * as bettingLineData from "../db/bettingLineData";

export const getBettingLines = async (sportEventId: number): Promise<IBettingLine[]> => {
    return bettingLineData.getBettingLines(sportEventId);
}
export const getBettingLine = async (bettingLineId: number) => {
    return bettingLineData.getBettingLine(bettingLineId);
}
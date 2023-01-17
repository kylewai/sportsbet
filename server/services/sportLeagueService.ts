import { Pool } from "pg";
import { ILeague } from "../models/League";
import { ISport } from "../models/Sport";
import * as sportLeagueData from "../db/sportLeagueData";

export const getLeagues = async (): Promise<ILeague[] | undefined> => {
    return sportLeagueData.getLeagues();
}

export const getSports = async (): Promise<ISport[] | undefined> => {
    return sportLeagueData.getSports();
}
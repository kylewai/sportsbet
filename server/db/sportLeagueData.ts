import { Pool } from "pg";
import { knexPg } from "../dbConnection";
import { ILeague } from "../models/League";
import { ISport } from "../models/Sport";

export const getLeagues = async (): Promise<ILeague[] | undefined> => {
    return knexPg("league")
        .select("id", "name", { sportId: "sport_id_fkey" });
}

export const getSports = async (): Promise<ISport[] | undefined> => {
    return knexPg("league")
        .select("id", "name");
}
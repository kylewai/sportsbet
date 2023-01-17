import { Pool } from "pg";
import knex from "knex";
import dotenv from "dotenv";

dotenv.config(); //load environment variables into proces.env

const dbPort = parseInt(process.env.PGPORT || "") || 0;

export const knexPg = knex({
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    },
    // connection: {
    //     user: process.env.PGUSER,
    //     host: process.env.PGHOST,
    //     database: process.env.PGDATABASE,
    //     password: process.env.PGPASSWORD,
    //     port: dbPort
    // },
    pool: {
        min: 0,
        max: 10
    }
});
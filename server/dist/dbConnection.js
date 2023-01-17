"use strict";
exports.__esModule = true;
exports.knexPg = void 0;
var knex_1 = require("knex");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config(); //load environment variables into proces.env
var dbPort = parseInt(process.env.PGPORT || "") || 0;
exports.knexPg = (0, knex_1["default"])({
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: false
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

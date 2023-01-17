"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knexPg = void 0;
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); //load environment variables into proces.env
const dbPort = parseInt(process.env.PGPORT || "") || 0;
exports.knexPg = (0, knex_1.default)({
    client: "pg",
    connection: {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: dbPort
    },
    pool: {
        min: 0,
        max: 10
    }
});

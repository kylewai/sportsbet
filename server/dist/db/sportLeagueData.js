"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSports = exports.getLeagues = void 0;
const dbConnection_1 = require("../dbConnection");
const getLeagues = async () => {
    return (0, dbConnection_1.knexPg)("league")
        .select("id", "name", { sportId: "sport_id_fkey" });
};
exports.getLeagues = getLeagues;
const getSports = async () => {
    return (0, dbConnection_1.knexPg)("league")
        .select("id", "name");
};
exports.getSports = getSports;

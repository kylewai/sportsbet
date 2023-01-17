"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccount = exports.removeBalance = exports.addBalance = void 0;
const dbConnection_1 = require("../dbConnection");
const addBalance = async (userId, balance) => {
    return (0, dbConnection_1.knexPg)("bet_account")
        .where("user_id_fkey", "=", userId)
        .increment("balance", balance)
        .then();
};
exports.addBalance = addBalance;
const removeBalance = (userId, removeBalance, trx) => {
    let baseQuery = (0, dbConnection_1.knexPg)("bet_account")
        .where("user_id_fkey", "=", userId)
        .decrement("balance", removeBalance);
    if (trx !== undefined) {
        baseQuery = baseQuery.transacting(trx);
    }
    return baseQuery.then();
};
exports.removeBalance = removeBalance;
const getAccount = (userId) => {
    return (0, dbConnection_1.knexPg)("bet_account")
        .where("user_id_fkey", "=", userId)
        .select("balance")
        .then();
};
exports.getAccount = getAccount;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeBet = exports.addUser = exports.getUserByUsername = exports.getUser = void 0;
const dbConnection_1 = require("../dbConnection");
const accountData_1 = require("./accountData");
const getUser = async (userId) => {
    return (0, dbConnection_1.knexPg)("user")
        .where("id", "=", userId)
        .first("id", "name", "username", "address", "email", { betAccountId: "bet_account_id_fkey" }, "salt", "password");
};
exports.getUser = getUser;
const getUserByUsername = async (username) => {
    return (0, dbConnection_1.knexPg)("user")
        .where("username", "=", username)
        .first("id", "name", "username", "address", "email", { betAccountId: "bet_account_id_fkey" }, "salt", "password");
};
exports.getUserByUsername = getUserByUsername;
const addUser = (username, password, salt) => {
    return dbConnection_1.knexPg.transaction(async (trx) => {
        const user = await trx("user")
            .insert({ "username": username, "password": password, "salt": salt }, ["id"]);
        await trx("bet_account")
            .insert({ balance: 0, user_id_fkey: user[0].id });
        //Does this really need to be a separate query?
        return await trx("user")
            .where("id", "=", user[0].id)
            .first("id", "name", "username", "address", "email", { betAccountId: "bet_account_id_fkey" }, "salt", "password");
    });
};
exports.addUser = addUser;
const placeBet = (userId, placeBetInfo) => {
    //Add to bet table
    //Decrement account balance.
    return dbConnection_1.knexPg.transaction(async (trx) => {
        return Promise.all(placeBetInfo.map(async (info) => {
            await trx("bet")
                .insert({
                "user_id_fkey": userId,
                "wager": info.wager,
                "over_under_pos": info.overOrUnder,
                "favorite_underdog_pos": info.favoriteOrUnderdog,
                "betting_line_id_fkey": info.bettingLineId,
                "spread": info.spread,
                "game_total": info.gameTotal,
                "odds": info.odds
            });
            await (0, accountData_1.removeBalance)(userId, info.wager, trx);
        }));
    });
};
exports.placeBet = placeBet;

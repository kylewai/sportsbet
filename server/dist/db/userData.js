"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.getUserByUsername = exports.getUser = void 0;
const dbConnection_1 = require("../dbConnection");
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
    return (0, dbConnection_1.knexPg)("user")
        .insert({ "username": username, "password": password, "salt": salt }).then();
};
exports.addUser = addUser;

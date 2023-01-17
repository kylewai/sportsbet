import { Knex } from "knex";
import { knexPg } from "../dbConnection";
import { IBet } from "../models/Bet";
import { IUserAccount } from "../models/UserAccount";

export const addBalance = async (userId: number, balance: number): Promise<void> => {
    return knexPg("bet_account")
        .where("user_id_fkey", "=", userId)
        .increment("balance", balance)
        .then();
}

export const removeBalance = (userId: number, removeBalance: number, trx: Knex.Transaction): Promise<void> => {
    let baseQuery = knexPg("bet_account")
        .where("user_id_fkey", "=", userId)
        .decrement("balance", removeBalance);

    if (trx !== undefined) {
        baseQuery = baseQuery.transacting(trx);
    }
    return baseQuery.then();
}
export const getAccount = (userId: number) => {
    return knexPg("bet_account")
        .where("user_id_fkey", "=", userId)
        .select("balance")
        .then();
}
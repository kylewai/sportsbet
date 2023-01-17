import { Pool } from "pg";
import { knexPg } from "../dbConnection";
import { IBet } from "../models/Bet";
import { IUser } from "../models/User";
import { removeBalance } from "./accountData";

export const getUser = async (userId: number): Promise<IUser | undefined> => {
    return knexPg("user")
        .where("id", "=", userId)
        .first("id", "name", "username", "address", "email", { betAccountId: "bet_account_id_fkey" }, "salt", "password");
}

export const getUserByUsername = async (username: string): Promise<IUser | undefined> => {
    return knexPg("user")
        .where("username", "=", username)
        .first("id", "name", "username", "address", "email", { betAccountId: "bet_account_id_fkey" }, "salt", "password");
}

export const addUser = (username: string, password: Buffer, salt: string): Promise<IUser | undefined | void> => {

    return knexPg.transaction(async (trx) => {
        const user = await trx("user")
            .insert({ "username": username, "password": password, "salt": salt }, ["id"]);

        await trx("bet_account")
            .insert({ balance: 0, user_id_fkey: user[0].id });

        //Does this really need to be a separate query?
        return await trx("user")
            .where("id", "=", user[0].id)
            .first("id", "name", "username", "address", "email", { betAccountId: "bet_account_id_fkey" }, "salt", "password");
    });
}

export const placeBet = (userId: number, placeBetInfo: IBet[]) => {
    //Add to bet table
    //Decrement account balance.

    return knexPg.transaction(async (trx) => {
        return Promise.all(placeBetInfo.map(async info => {
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

            await removeBalance(userId, info.wager, trx);
        }));
    });
}
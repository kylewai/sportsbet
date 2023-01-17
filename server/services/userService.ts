import { Pool } from "pg";
import * as userData from "../db/userData";
import * as accountService from "./accountService";
import { IUser } from "../models/User";
import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import { IBet } from "../models/Bet";

export const getUsersById = async (userId: number): Promise<IUser | undefined> => {
    return userData.getUser(userId);
}

export const getUserByUsername = async (username: string): Promise<IUser | undefined> => {
    return userData.getUserByUsername(username);
}

export const register = async (username: string, password: string): Promise<IUser> => {
    const salt = getSalt(16);

    return new Promise((resolve, reject) =>
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) {
                reject(new Error("Unsuccessful registration - error generating credentials"));
            }
            userData.addUser(username, hashedPassword, salt).then((user) => {
                if (!user) {
                    reject(new Error("Unsuccessful registration"));
                }
                resolve(user!);
            });
        }));
}

export const placeBet = async (userId: number, placeBetInfo: IBet[]) => {
    //TODO: check that they have adequate balance;
    const currentUserBalance = await accountService.getBalance(userId);
    const wagerAmount = placeBetInfo.reduce((total, info) => {
        if (info.wager < 0) {
            throw new Error("Wager cannot be a negative value");
        }
        return total + info.wager;
    }, 0);

    if (currentUserBalance < wagerAmount) {
        throw new Error("Bet cannot be placed: insufficient funds");
    }
    return userData.placeBet(userId, placeBetInfo);
}

export const setUpLocalAuthStrategy = () => {
    passport.use(new LocalStrategy(async (username, password, cb) => {
        try {
            const user = await getUserByUsername(username);
            if (!user) {
                cb(null, false, { message: "Incorrect username or password" });
                return;
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", (err, hashedPassword) => {
                if (err) {
                    cb(err);
                    return;
                }
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    cb(null, false, { message: "Incorrect username or password" });
                    return;
                }
                cb(null, user);
            });
        }
        catch (err: any) {
            cb(err);
        }
    }));
}

export const setupLoginSessionStorage = () => {
    passport.serializeUser((user: any, cb) => {
        process.nextTick(function () {
            cb(null, user.id);
        });
    });

    passport.deserializeUser((id: number, cb) => {
        process.nextTick(async () => {
            try {
                const user = await getUsersById(id);
                if (!user) {
                    return cb(null);
                }
                return cb(null, user);
            }
            catch (err: any) {
                return cb(err);
            }
        });
    });
}

const getSalt = (length: number) => {
    return crypto.randomBytes(length).toString("hex");
}

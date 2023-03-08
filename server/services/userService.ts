import { Pool } from "pg";
import * as userData from "../db/userData";
import * as accountService from "./accountService";
import { IUser } from "../models/User";
import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import { BetFollowUpAction, getBetPosition, IBet, IBetFollowup, IConfirmBetData } from "../models/Bet";
import { BetType, getBetCellId } from "../models/BettingLine";
import { getBettingLine } from "./bettingLineService";

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

export const placeBet = async (userId: number, placeBetInfo: IBet[]): Promise<IBetFollowup> => {
    let followUpAction = BetFollowUpAction.None;
    let followUpData: { [betCellId: string]: IConfirmBetData } | undefined = undefined;
    console.log(JSON.stringify(placeBetInfo));
    placeBetInfo.forEach(async info => {
        const realTimeInfo = (await getBettingLine(info.bettingLineId))[0];
        const betCellId = getBetCellId(realTimeInfo, getBetPosition(info));
        let realTimeOdds;
        if (realTimeInfo.betType === BetType.MoneyLine || realTimeInfo.betType === BetType.Spread) {
            realTimeOdds = info.favoriteOrUnderdog ? realTimeInfo.favoriteOdds : realTimeInfo.underdogOdds;
        }
        else {
            realTimeOdds = info.overOrUnder ? realTimeInfo.overOdds : realTimeInfo.underOdds;
        }
        if (realTimeInfo.betType === BetType.Spread && realTimeInfo.spread !== info.spread) {
            followUpAction = BetFollowUpAction.ConfirmBet;
            followUpData = followUpData ?? {};
            followUpData[betCellId] = {
                ...followUpData[betCellId],
                currSpread: realTimeInfo.spread,
                betPlacedSpread: info.spread
            };
        }
        if (realTimeInfo.betType === BetType.GameTotal && realTimeInfo.gameTotal !== info.gameTotal) {
            followUpAction = BetFollowUpAction.ConfirmBet;
            followUpData = followUpData ?? {};
            followUpData[betCellId] = {
                ...followUpData[betCellId],
                currGameTotal: realTimeInfo.gameTotal,
                betPlacedGameTotal: info.gameTotal
            };
        }
        if (realTimeOdds !== info.odds) {
            followUpAction = BetFollowUpAction.ConfirmBet;
            followUpData = followUpData ?? {};
            followUpData[betCellId] = {
                ...followUpData[betCellId],
                currOdds: realTimeOdds,
                betPlacedOdds: info.odds
            };
        }
    });
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
    if (followUpAction === BetFollowUpAction.None) {
        await userData.placeBet(userId, placeBetInfo);
    }
    return { action: followUpAction, data: followUpData };
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

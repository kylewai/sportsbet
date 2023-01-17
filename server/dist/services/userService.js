"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLoginSessionStorage = exports.setUpLocalAuthStrategy = exports.placeBet = exports.register = exports.getUserByUsername = exports.getUsersById = void 0;
const userData = __importStar(require("../db/userData"));
const accountService = __importStar(require("./accountService"));
const passport_1 = __importDefault(require("passport"));
const crypto_1 = __importDefault(require("crypto"));
const passport_local_1 = require("passport-local");
const getUsersById = async (userId) => {
    return userData.getUser(userId);
};
exports.getUsersById = getUsersById;
const getUserByUsername = async (username) => {
    return userData.getUserByUsername(username);
};
exports.getUserByUsername = getUserByUsername;
const register = async (username, password) => {
    const salt = getSalt(16);
    return new Promise((resolve, reject) => crypto_1.default.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
        if (err) {
            reject(new Error("Unsuccessful registration - error generating credentials"));
        }
        userData.addUser(username, hashedPassword, salt).then((user) => {
            if (!user) {
                reject(new Error("Unsuccessful registration"));
            }
            resolve(user);
        });
    }));
};
exports.register = register;
const placeBet = async (userId, placeBetInfo) => {
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
};
exports.placeBet = placeBet;
const setUpLocalAuthStrategy = () => {
    passport_1.default.use(new passport_local_1.Strategy(async (username, password, cb) => {
        try {
            const user = await (0, exports.getUserByUsername)(username);
            if (!user) {
                cb(null, false, { message: "Incorrect username or password" });
                return;
            }
            crypto_1.default.pbkdf2(password, user.salt, 310000, 32, "sha256", (err, hashedPassword) => {
                if (err) {
                    cb(err);
                    return;
                }
                if (!crypto_1.default.timingSafeEqual(user.password, hashedPassword)) {
                    cb(null, false, { message: "Incorrect username or password" });
                    return;
                }
                cb(null, user);
            });
        }
        catch (err) {
            cb(err);
        }
    }));
};
exports.setUpLocalAuthStrategy = setUpLocalAuthStrategy;
const setupLoginSessionStorage = () => {
    passport_1.default.serializeUser((user, cb) => {
        process.nextTick(function () {
            cb(null, user.id);
        });
    });
    passport_1.default.deserializeUser((id, cb) => {
        process.nextTick(async () => {
            try {
                const user = await (0, exports.getUsersById)(id);
                if (!user) {
                    return cb(null);
                }
                return cb(null, user);
            }
            catch (err) {
                return cb(err);
            }
        });
    });
};
exports.setupLoginSessionStorage = setupLoginSessionStorage;
const getSalt = (length) => {
    return crypto_1.default.randomBytes(length).toString("hex");
};

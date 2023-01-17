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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const crypto_1 = __importDefault(require("crypto"));
const userService = __importStar(require("../services/userService"));
const setUpLocalAuthStrategy = () => {
    passport_1.default.use(new passport_local_1.Strategy(async (username, password, cb) => {
        try {
            const user = await userService.getUserByUsername(username);
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
const setupLoginSessionStorage = () => {
    passport_1.default.serializeUser((user, cb) => {
        process.nextTick(function () {
            console.log("serializing!: " + user.id);
            cb(null, user.id);
        });
    });
    passport_1.default.deserializeUser((id, cb) => {
        process.nextTick(async () => {
            try {
                console.log("deserilizing with id from sesh");
                const user = await userService.getUsersById(id);
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

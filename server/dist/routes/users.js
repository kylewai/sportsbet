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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const userService = __importStar(require("../services/userService"));
const accountService = __importStar(require("../services/accountService"));
const router = express_1.default.Router();
router.post("/login", passport_1.default.authenticate("local", { failureRedirect: "/users/login/failure", failureMessage: true }), async (req, res, next) => {
    res.sendStatus(200);
});
router.get("/login/failure", (req, res) => {
    const sessionMsgs = req.session.messages;
    res.status(401).send(sessionMsgs[sessionMsgs.length - 1]);
});
const createLoginSession = (req, res, next) => {
    req.login(res.locals.user, (err) => {
        if (err) {
            next(err);
        }
        res.sendStatus(200);
    });
};
router.post("/register", async (req, res, next) => {
    userService.register(req.body.username, req.body.password)
        .then(user => {
        res.locals.user = user;
        next();
    })
        .catch(next);
}, createLoginSession);
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});
router.post("/account/balance", async (req, res, next) => {
    accountService.addBalance(req.user.id, req.body.balance)
        .then(() => res.sendStatus(200))
        .catch(next);
});
router.post("/placebet", async (req, res, next) => {
    const placeBetInfo = req.body.placeBetInfo;
    userService.placeBet(req.user.id, placeBetInfo)
        .then(() => res.sendStatus(200))
        .catch(next);
});
exports.default = router;

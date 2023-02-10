import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import * as userService from "../services/userService";
import * as accountService from "../services/accountService";
import { IUser } from "../models/User";
import { IBet } from "../models/Bet";
const router = express.Router();

router.post("/login", passport.authenticate("local", { failureRedirect: "/users/login/failure", failureMessage: true }), async (req, res, next) => {
    res.sendStatus(200);
});

router.get("/login/failure", (req, res) => {
    const sessionMsgs = (req.session as any).messages;
    res.status(401).send(sessionMsgs[sessionMsgs.length - 1]);
});

const createLoginSession = (req: Request, res: Response, next: NextFunction) => {
    req.login(res.locals.user, (err) => {
        if (err) { next(err); }
        res.sendStatus(200);
    });
}

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
        if (err) { return next(err); }
        res.sendStatus(200);
    });
});

router.get("/account/balance", (req, res, next) => {
    accountService.getBalance((req.user as IUser).id)
        .then((balance) => res.json({ balance }))
        .catch(next);
});

router.post("/account/balance", (req, res, next) => {
    accountService.addBalance((req.user as IUser).id, req.body.balance)
        .then(() => res.sendStatus(200))
        .catch(next);
}
);

router.post("/placebet", async (req, res, next) => {
    const placeBetInfo: IBet[] = req.body.placeBetInfo;
    userService.placeBet((req.user as IUser).id, placeBetInfo)
        .then(() => res.sendStatus(200))
        .catch(next);
});

export default router;
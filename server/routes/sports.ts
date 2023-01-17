import express from "express";
import * as sportLeagueService from "../db/sportLeagueData";

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  sportLeagueService.getSports()
    .then((sports) => res.json(sports))
    .catch(next);
});

export default router;

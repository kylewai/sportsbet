import express from "express";
import * as sportEventService from "../db/sportEventData";
import * as sportLeagueService from "../db/sportLeagueData";

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  sportLeagueService.getLeagues()
    .then((events) => res.json(events))
    .catch(next);
});

router.get("/:league_id/events", async (req, res, next) => {
  sportEventService.getSportEvents(parseInt(req.params.league_id))
    .then((events) => res.json(events))
    .catch(next);
});

export default router;

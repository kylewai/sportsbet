"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getSportEvents = void 0;
var bettingLineService = require("./bettingLineData");
var BettingLine_1 = require("../models/BettingLine");
var dbConnection_1 = require("../dbConnection");
var getSportEvents = function (sportEventId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, dbConnection_1.knexPg)("sport_event")
                .where("sport_event.league_id_fkey", "=", sportEventId)
                .innerJoin({ travel_team: "team" }, "sport_event.travel_team_id_fkey", "=", "travel_team.id")
                .innerJoin({ home_team: "team" }, "sport_event.home_team_id_fkey", "=", "home_team.id")
                .innerJoin("city", "sport_event.city_id_fkey", "=", "city.id")
                .select({
                id: "sport_event.id",
                homeTeamId: "home_team_id_fkey",
                travelTeamId: "travel_team_id_fkey",
                isHomeTeamFavorite: "is_home_team_favorite",
                dateTime: "dt_tm",
                leagueId: "league_id_fkey",
                cityId: "sport_event.city_id_fkey",
                travelTeamName: "travel_team.name",
                homeTeamName: "home_team.name",
                cityName: "city.name"
            })
                .then(toSportEventsResponseFormat)];
    });
}); };
exports.getSportEvents = getSportEvents;
var toSportEventsResponseFormat = function (rows) {
    return Promise.all(rows.map(function (row) { return __awaiter(void 0, void 0, void 0, function () {
        var bettingLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bettingLineService.getBettingLines(row.id)];
                case 1:
                    bettingLines = _a.sent();
                    row.homeTeam = {
                        name: row.homeTeamName,
                        id: row.homeTeamId
                    };
                    row.travelTeam = {
                        name: row.travelTeamName,
                        id: row.travelTeamId
                    };
                    row.city = {
                        name: row.cityName,
                        id: row.cityId
                    };
                    delete row.homeTeamName;
                    delete row.homeTeamId;
                    delete row.travelTeamName;
                    delete row.travelTeamId;
                    delete row.cityName;
                    delete row.cityId;
                    delete row.favoriteTeamId;
                    row.bettingLines = (0, BettingLine_1.getBettingLinesByType)(bettingLines);
                    return [2 /*return*/, row];
            }
        });
    }); }));
};

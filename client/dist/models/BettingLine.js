"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.betTypeToString = exports.BetPosition = exports.BetType = void 0;
var BetType;
(function (BetType) {
    BetType[BetType["MoneyLine"] = 1] = "MoneyLine";
    BetType[BetType["Spread"] = 2] = "Spread";
    BetType[BetType["GameTotal"] = 3] = "GameTotal";
})(BetType = exports.BetType || (exports.BetType = {}));
var BetPosition;
(function (BetPosition) {
    BetPosition[BetPosition["Favorite"] = 0] = "Favorite";
    BetPosition[BetPosition["Underdog"] = 1] = "Underdog";
    BetPosition[BetPosition["Over"] = 2] = "Over";
    BetPosition[BetPosition["Under"] = 3] = "Under";
})(BetPosition = exports.BetPosition || (exports.BetPosition = {}));
const betTypeToString = (betType) => {
    switch (betType) {
        case BetType.MoneyLine: return "Money Line";
        case BetType.Spread: return "Spread";
        case BetType.GameTotal: return "Game Total";
        default: return "";
    }
};
exports.betTypeToString = betTypeToString;

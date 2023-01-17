"use strict";
exports.__esModule = true;
exports.getBettingLinesByType = exports.BetType = void 0;
var BetType;
(function (BetType) {
    BetType[BetType["MoneyLine"] = 1] = "MoneyLine";
    BetType[BetType["Spread"] = 2] = "Spread";
    BetType[BetType["GameTotal"] = 3] = "GameTotal";
})(BetType = exports.BetType || (exports.BetType = {}));
var getBettingLinesByType = function (bettingLines) {
    return bettingLines === null || bettingLines === void 0 ? void 0 : bettingLines.reduce(function (map, bettingLine) {
        map[bettingLine.betType] = bettingLine;
        return map;
    }, {});
};
exports.getBettingLinesByType = getBettingLinesByType;

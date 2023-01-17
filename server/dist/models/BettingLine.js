"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBettingLinesByType = exports.BetType = void 0;
var BetType;
(function (BetType) {
    BetType[BetType["MoneyLine"] = 1] = "MoneyLine";
    BetType[BetType["Spread"] = 2] = "Spread";
    BetType[BetType["GameTotal"] = 3] = "GameTotal";
})(BetType = exports.BetType || (exports.BetType = {}));
const getBettingLinesByType = (bettingLines) => {
    return bettingLines?.reduce((map, bettingLine) => {
        map[bettingLine.betType] = bettingLine;
        return map;
    }, {});
};
exports.getBettingLinesByType = getBettingLinesByType;

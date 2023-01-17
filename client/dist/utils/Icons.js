"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalIcon = exports.IconType = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const importSVGs = require.context("../icons", true, /\.svg$/);
const svgs = importSVGs.keys().reduce((images, path) => {
    images[path] = importSVGs(path);
    return images;
}, {});
var IconType;
(function (IconType) {
    IconType[IconType["Sport"] = 0] = "Sport";
    IconType[IconType["League"] = 1] = "League";
    IconType[IconType["Team"] = 2] = "Team";
})(IconType = exports.IconType || (exports.IconType = {}));
const NormalIcon = (props) => {
    return ((0, jsx_runtime_1.jsx)("img", { src: getIconFromKey(props.iconType, props.iconKey), style: { width: 24, height: 24, verticalAlign: "middle" }, alt: "logo" }));
};
exports.NormalIcon = NormalIcon;
function getIconFromKey(iconType, iconKey) {
    switch (iconType) {
        case IconType.League: return getLeagueIconFromId(iconKey);
        case IconType.Sport: return getSportIconFromId(iconKey);
        case IconType.Team: return getTeamIconFromId(iconKey);
        default: return "";
    }
}
function getLeagueIconFromId(id) {
    switch (id) {
        case 1: return svgs["./nflLogo.svg"];
        case 2: return svgs["./eplLogo.svg"];
        case 3: return svgs["./serieALogo.svg"];
        default: return "";
    }
}
function getSportIconFromId(id) {
    return "";
}
function getTeamIconFromId(id) {
    switch (id) {
        case 1: return svgs["./vikingsTeam.svg"];
        case 2: return svgs["./jagsTeam.svg"];
        case 3: return svgs["./billsTeam.svg"];
        case 4: return svgs["./dolphinsTeam.svg"];
        case 5: return svgs["./chargersTeam.svg"];
        case 6: return svgs["./broncosTeam.svg"];
        case 7: return svgs["./ravensTeam.svg"];
        case 8: return svgs["./bengalsTeam.svg"];
        case 9: return svgs["./steelersTeam.svg"];
        case 10: return svgs["./brownsTeam.svg"];
        case 11: return svgs["./patriotsTeam.svg"];
        case 12: return svgs["./jetsTeam.svg"];
        case 13: return svgs["./chiefsTeam.svg"];
        case 14: return svgs["./raidersTeam.svg"];
        case 15: return svgs["./titansTeam.svg"];
        case 16: return svgs["./coltsTeam.svg"];
        case 17: return svgs["./texansTeam.svg"];
        case 18: return svgs["./eaglesTeam.svg"];
        case 19: return svgs["./cowboysTeam.svg"];
        case 20: return svgs["./giantsTeam.svg"];
        case 21: return svgs["./commandersTeam.svg"];
        case 22: return svgs["./49ersTeam.svg"];
        case 23: return svgs["./seahawksTeam.svg"];
        case 24: return svgs["./cardinalsTeam.svg"];
        case 25: return svgs["./ramsTeam.svg"];
        case 26: return svgs["./lionsTeam.svg"];
        case 27: return svgs["./packersTeam.svg"];
        case 28: return svgs["./bearsTeam.svg"];
        case 29: return svgs["./buccaneersTeam.svg"];
        case 30: return svgs["./panthersTeam.svg"];
        case 31: return svgs["./saintsTeam.svg"];
        case 32: return svgs["./falconsTeam.svg"];
        default: return "";
    }
}

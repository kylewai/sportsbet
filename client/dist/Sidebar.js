"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const swr_1 = __importDefault(require("swr"));
const Drawer_1 = __importDefault(require("@mui/material/Drawer"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemButton_1 = __importDefault(require("@mui/material/ListItemButton"));
const ListItemIcon_1 = __importDefault(require("@mui/material/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const Divider_1 = __importDefault(require("@mui/material/Divider"));
const DataFetcher_1 = require("./utils/DataFetcher");
const MoveToInbox_1 = __importDefault(require("@mui/icons-material/MoveToInbox"));
const Mail_1 = __importDefault(require("@mui/icons-material/Mail"));
const Icons_1 = require("./utils/Icons");
const react_router_dom_1 = require("react-router-dom");
const CustomAppBar_1 = require("./CustomAppBar");
const Sidebar = () => {
    const { data: leagues, error: leagueError } = (0, swr_1.default)("/leagues", DataFetcher_1.apiFetcher);
    const { data: sports, error: sportError } = (0, swr_1.default)("/sports", DataFetcher_1.apiFetcher);
    if (leagueError) {
        console.log(leagueError);
        return (0, jsx_runtime_1.jsx)("div", { children: "failed to load" });
    }
    if (!leagues || !sports)
        return (0, jsx_runtime_1.jsx)("div", { children: "loading..." });
    return ((0, jsx_runtime_1.jsxs)(Drawer_1.default, Object.assign({ variant: "permanent", sx: {
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: 240, boxSizing: 'border-box' },
        } }, { children: [(0, jsx_runtime_1.jsx)(CustomAppBar_1.Offset, {}), (0, jsx_runtime_1.jsxs)(Box_1.default, Object.assign({ sx: { overflow: 'auto' } }, { children: [(0, jsx_runtime_1.jsx)(QuickAccessLeaguesList, { leagues: leagues }), (0, jsx_runtime_1.jsx)(Divider_1.default, {}), (0, jsx_runtime_1.jsx)(QuickAccessSportsList, { sports: sports })] }))] })));
};
exports.Sidebar = Sidebar;
const QuickAccessLeaguesList = (props) => {
    return ((0, jsx_runtime_1.jsxs)(List_1.default, { children: [(0, jsx_runtime_1.jsx)(ListItem_1.default, {}), props.leagues.map((league, _index) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: "leagues/" + league.id + "/events", style: { color: 'inherit', textDecoration: 'inherit' } }, { children: (0, jsx_runtime_1.jsx)(ListItem_1.default, Object.assign({ disablePadding: true }, { children: (0, jsx_runtime_1.jsxs)(ListItemButton_1.default, { children: [(0, jsx_runtime_1.jsx)(ListItemIcon_1.default, { children: (0, jsx_runtime_1.jsx)(Icons_1.NormalIcon, { iconType: Icons_1.IconType.League, iconKey: league.id }) }), (0, jsx_runtime_1.jsx)(ListItemText_1.default, { primary: league.name })] }) })) }), league.name)))] }));
};
const QuickAccessSportsList = (props) => {
    return ((0, jsx_runtime_1.jsx)(List_1.default, { children: props.sports.map((sport, index) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: "leagues/" + sport.name, style: { color: 'inherit', textDecoration: 'inherit' } }, { children: (0, jsx_runtime_1.jsx)(ListItem_1.default, Object.assign({ disablePadding: true }, { children: (0, jsx_runtime_1.jsxs)(ListItemButton_1.default, { children: [(0, jsx_runtime_1.jsx)(ListItemIcon_1.default, { children: index % 2 === 0 ? (0, jsx_runtime_1.jsx)(MoveToInbox_1.default, {}) : (0, jsx_runtime_1.jsx)(Mail_1.default, {}) }), (0, jsx_runtime_1.jsx)(ListItemText_1.default, { primary: sport.name })] }) })) }), sport.name))) }));
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./App.css");
const Sidebar_1 = require("./Sidebar");
const Box_1 = __importDefault(require("@mui/material/Box"));
const react_router_dom_1 = require("react-router-dom");
const MainContent_1 = require("./MainContent");
const CustomAppBar_1 = require("./CustomAppBar");
const AuthProvider_1 = require("./auth/AuthProvider");
const SignUp_1 = require("./auth/SignUp");
const BetEvents_1 = require("./BetEvents");
const BetSlip_1 = require("./BetSlip");
const Account_1 = require("./user/Account");
function App() {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(AuthProvider_1.AuthProvider, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, Object.assign({ element: (0, jsx_runtime_1.jsx)(AppLayout, {}) }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, Object.assign({ path: "/", element: (0, jsx_runtime_1.jsx)(Home, {}) }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, Object.assign({ path: "leagues" }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, Object.assign({ path: ":leagueId/events", element: (0, jsx_runtime_1.jsx)(BetEvents_1.BettingEventsList, {}) }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "betSlip", element: (0, jsx_runtime_1.jsx)(BetSlip_1.BetSlip, {}) }) })) })) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/account", element: (0, jsx_runtime_1.jsx)(Account_1.Account, {}) })] })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/signup", element: (0, jsx_runtime_1.jsx)(SignUp_1.SignUp, {}) })] }) }) }));
}
const AppLayout = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(CustomAppBar_1.CustomAppBar, {}), (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {})] }));
};
const Home = () => {
    return ((0, jsx_runtime_1.jsxs)(Box_1.default, Object.assign({ sx: { display: 'flex' } }, { children: [(0, jsx_runtime_1.jsx)(Sidebar_1.Sidebar, {}), (0, jsx_runtime_1.jsx)(Box_1.default, Object.assign({ component: "main", sx: { flexGrow: 1, p: 1, pt: 0 } }, { children: (0, jsx_runtime_1.jsx)(MainContent_1.MainContent, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) }) }))] })));
};
exports.default = App;

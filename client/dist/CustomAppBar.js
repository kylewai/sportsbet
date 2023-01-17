"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAppBar = exports.Offset = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const AppBar_1 = __importDefault(require("@mui/material/AppBar"));
const Toolbar_1 = __importDefault(require("@mui/material/Toolbar"));
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const Menu_1 = __importDefault(require("@mui/material/Menu"));
const MenuItem_1 = __importDefault(require("@mui/material/MenuItem"));
const AccountCircle_1 = __importDefault(require("@mui/icons-material/AccountCircle"));
const react_1 = require("react");
const AuthProvider_1 = require("./auth/AuthProvider");
const DataFetcher_1 = require("./utils/DataFetcher");
const react_router_dom_1 = require("react-router-dom");
const react_router_dom_2 = require("react-router-dom");
const styles_1 = require("@mui/material/styles");
exports.Offset = (0, styles_1.styled)('div')(({ theme }) => theme.mixins.toolbar);
const CustomAppBar = () => {
    const { isAuthenticated, setAuthRequest, setIsAuthenticated } = (0, react_1.useContext)(AuthProvider_1.AuthContext);
    const [anchorEl, setAnchorEl] = (0, react_1.useState)(null);
    const location = (0, react_router_dom_1.useLocation)();
    const handleClose = () => {
        setAnchorEl(null);
    };
    const openMenu = (event) => {
        console.log(anchorEl);
        setAnchorEl(event.currentTarget);
    };
    const handleLogout = () => {
        setAnchorEl(null);
        fetch("/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => (0, DataFetcher_1.manageErrors)(response))
            .then(() => setIsAuthenticated(false));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AppBar_1.default, Object.assign({ position: "fixed", sx: { zIndex: (theme) => theme.zIndex.drawer + 1 } }, { children: (0, jsx_runtime_1.jsxs)(Toolbar_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ variant: "h6", component: "div", sx: { flexGrow: 1 } }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_2.Link, Object.assign({ to: "/", style: { color: 'inherit', textDecoration: 'inherit' } }, { children: "KWSports" })) })), isAuthenticated && (0, jsx_runtime_1.jsx)(material_1.Button, Object.assign({ color: "inherit" }, { children: "My Bets" })), isAuthenticated &&
                            (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(IconButton_1.default, Object.assign({ size: "large", "aria-label": "account of current user", "aria-controls": "menu-appbar", "aria-haspopup": "true", onClick: openMenu, color: "inherit" }, { children: (0, jsx_runtime_1.jsx)(AccountCircle_1.default, {}) })), (0, jsx_runtime_1.jsxs)(Menu_1.default, Object.assign({ id: "menu-appbar", anchorEl: anchorEl, anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }, keepMounted: true, transformOrigin: {
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }, open: anchorEl != null, onClose: handleClose }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_2.Link, Object.assign({ to: "/account", style: { color: 'inherit', textDecoration: 'inherit' } }, { children: (0, jsx_runtime_1.jsx)(MenuItem_1.default, Object.assign({ onClick: handleClose }, { children: "Account" })) })), (0, jsx_runtime_1.jsx)(MenuItem_1.default, Object.assign({ onClick: handleLogout }, { children: "Logout" }))] }))] }), !isAuthenticated &&
                            (0, jsx_runtime_1.jsx)(material_1.Button, Object.assign({ onClick: () => setAuthRequest({ isAuthRequested: true, previousRoute: location.pathname }), color: "inherit" }, { children: "Login" }))] }) })), (0, jsx_runtime_1.jsx)(exports.Offset, {})] }));
};
exports.CustomAppBar = CustomAppBar;

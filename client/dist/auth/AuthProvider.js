"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = exports.AuthContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const react_1 = require("react");
const SignIn_1 = require("./SignIn");
exports.AuthContext = React.createContext({
    authRequest: { isAuthRequested: false, previousRoute: "" },
    isAuthenticated: false,
    setAuthRequest: (authRequest) => { },
    setIsAuthenticated: (isAuthenticated) => { }
});
const AuthProvider = (props) => {
    const [authRequest, setAuthRequest] = (0, react_1.useState)({ isAuthRequested: false, previousRoute: undefined });
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)(exports.AuthContext.Provider, Object.assign({ value: { isAuthenticated: isAuthenticated, authRequest: authRequest, setAuthRequest: setAuthRequest, setIsAuthenticated: setIsAuthenticated } }, { children: [props.children, (0, jsx_runtime_1.jsx)(SignIn_1.SignIn, { setIsAuthenticated: setIsAuthenticated })] })));
};
exports.AuthProvider = AuthProvider;

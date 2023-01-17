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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Box_1 = __importDefault(require("@mui/material/Box"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const material_1 = require("@mui/material");
const DataFetcher_1 = require("../utils/DataFetcher");
const react_router_dom_1 = require("react-router-dom");
const AuthProvider_1 = require("./AuthProvider");
const authFormStyle = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};
const SignUp = () => {
    const usernameInputRef = (0, react_1.useRef)();
    const passwordInputRef = (0, react_1.useRef)();
    const [errMsg, setErrMsg] = (0, react_1.useState)("");
    const navigate = (0, react_router_dom_1.useNavigate)();
    const context = (0, react_1.useContext)(AuthProvider_1.AuthContext);
    const register = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const username = (_a = usernameInputRef.current) === null || _a === void 0 ? void 0 : _a.value;
        const password = (_b = passwordInputRef.current) === null || _b === void 0 ? void 0 : _b.value;
        if (!username || !password) {
            setErrMsg("Username and password must be filled out");
            return;
        }
        fetch("/users/register", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => (0, DataFetcher_1.manageErrors)(response))
            .then(() => {
            context.setIsAuthenticated(true);
            navigate("/");
        })
            .catch((error) => setErrMsg(error.message));
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(Box_1.default, Object.assign({ sx: authFormStyle }, { children: [(0, jsx_runtime_1.jsx)("h2", Object.assign({ style: { display: "flex", justifyContent: "center" } }, { children: "KWSports" })), (0, jsx_runtime_1.jsxs)(material_1.Stack, { children: [(0, jsx_runtime_1.jsx)(TextField_1.default, { inputRef: usernameInputRef, margin: "dense", id: "outlined-basic", label: "Username", variant: "outlined" }), (0, jsx_runtime_1.jsx)(TextField_1.default, { inputRef: passwordInputRef, margin: "dense", id: "outlined-basic", label: "Password", type: "password", variant: "outlined" })] }), (0, jsx_runtime_1.jsx)("p", Object.assign({ style: { color: "red" } }, { children: errMsg })), (0, jsx_runtime_1.jsx)(Button_1.default, Object.assign({ onClick: register, sx: { width: 400 }, variant: "contained", size: "large" }, { children: "Sign up" }))] })) }));
};
exports.SignUp = SignUp;

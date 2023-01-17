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
exports.SignIn = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AuthProvider_1 = require("./AuthProvider");
const Modal_1 = __importDefault(require("@mui/material/Modal"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const material_1 = require("@mui/material");
const react_router_dom_1 = require("react-router-dom");
const DataFetcher_1 = require("../utils/DataFetcher");
const authFormStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};
const SignIn = (props) => {
    const { authRequest, setAuthRequest, setIsAuthenticated } = (0, react_1.useContext)(AuthProvider_1.AuthContext);
    const [errMsg, setErrMsg] = (0, react_1.useState)("");
    const usernameInputRef = (0, react_1.useRef)();
    const passwordInputRef = (0, react_1.useRef)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const username = (_a = usernameInputRef.current) === null || _a === void 0 ? void 0 : _a.value;
        const password = (_b = passwordInputRef.current) === null || _b === void 0 ? void 0 : _b.value;
        if (!username || !password) {
            setErrMsg("Username and password must be filled out");
            return;
        }
        fetch("/users/login", {
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
            //navigate(authRequest.previousRoute ?? "/");
            setIsAuthenticated(true);
            setAuthRequest({ isAuthRequested: false });
        })
            .catch((error) => setErrMsg(error.message));
    });
    const onClose = () => {
        if (authRequest.previousRoute) {
            navigate(authRequest.previousRoute);
        }
        setAuthRequest({ isAuthRequested: false });
        setErrMsg("");
    };
    return ((0, jsx_runtime_1.jsx)(Modal_1.default, Object.assign({ open: authRequest.isAuthRequested, onClose: onClose, "aria-labelledby": "modal-modal-title", "aria-describedby": "modal-modal-description" }, { children: (0, jsx_runtime_1.jsxs)(Box_1.default, Object.assign({ sx: authFormStyle, component: "form" }, { children: [(0, jsx_runtime_1.jsx)(TextField_1.default, { inputRef: usernameInputRef, fullWidth: true, margin: "dense", id: "outlined-basic", label: "Username", variant: "outlined" }), (0, jsx_runtime_1.jsx)(TextField_1.default, { inputRef: passwordInputRef, fullWidth: true, margin: "dense", id: "outlined-basic", label: "Password", type: "password", variant: "outlined" }), (0, jsx_runtime_1.jsx)("p", Object.assign({ style: { color: "red" } }, { children: errMsg })), (0, jsx_runtime_1.jsxs)(Stack_1.default, Object.assign({ direction: "column", spacing: 1, alignItems: "center", sx: { marginTop: 1 } }, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, Object.assign({ onClick: authenticate, sx: { width: 400 }, variant: "contained", size: "large" }, { children: "Sign in" })), (0, jsx_runtime_1.jsxs)(Box_1.default, Object.assign({ sx: { width: "100%" } }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ onClick: () => setAuthRequest({ isAuthRequested: false }), to: "/signup" }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ sx: { float: 'left' } }, { children: "Join now" })) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: "/" }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ sx: { float: 'right' } }, { children: "Trouble logging in?" })) }))] }))] }))] })) })));
};
exports.SignIn = SignIn;

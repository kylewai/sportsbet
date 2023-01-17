"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Box_1 = __importDefault(require("@mui/material/Box"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Snackbar_1 = __importDefault(require("@mui/material/Snackbar"));
const react_1 = require("react");
const DataFetcher_1 = require("../utils/DataFetcher");
const Account = () => {
    const balanceInput = (0, react_1.useRef)(null);
    const [errMsg, setErrMsg] = (0, react_1.useState)("");
    const [snackBarOpen, setSnackBarOpen] = (0, react_1.useState)(false);
    const transferMoney = () => {
        var _a;
        const money = Number((_a = balanceInput.current) === null || _a === void 0 ? void 0 : _a.value);
        if (money <= 0) {
            setErrMsg("Please enter a positive amount");
            return;
        }
        setErrMsg("");
        fetch("/users/account/balance", {
            method: "POST",
            body: JSON.stringify({
                balance: money
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => (0, DataFetcher_1.manageErrors)(response))
            .then(() => {
            setSnackBarOpen(true);
        })
            .catch((error) => setErrMsg(error.message));
        ;
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Box_1.default, Object.assign({ sx: { display: 'flex', mt: "10px" } }, { children: (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ container: true, direction: "column", spacing: 2 }, { children: [(0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, spacing: 2, container: true }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(Typography_1.default, Object.assign({ variant: "body1" }, { children: "Your Balance: " })) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(Typography_1.default, Object.assign({ variant: "body1" }, { children: "$100.00 " })) }))] })), (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ item: true, container: true, alignItems: "stretch" }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(TextField_1.default, { inputRef: balanceInput, type: "number" }) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, style: { display: "flex" } }, { children: (0, jsx_runtime_1.jsx)(Button_1.default, Object.assign({ onClick: transferMoney, variant: "contained" }, { children: "Add Balance" })) }))] })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(Typography_1.default, Object.assign({ variant: "body1", color: "red" }, { children: errMsg })) }))] })) })), (0, jsx_runtime_1.jsx)(Snackbar_1.default, { open: snackBarOpen, autoHideDuration: 3000, onClose: () => setSnackBarOpen(false), message: "Balance added" })] }));
};
exports.Account = Account;

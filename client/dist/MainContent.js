"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainContent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const MainContent = (props) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { paddingTop: "8px" } }, { children: props.children })) }));
};
exports.MainContent = MainContent;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Modal;
const jsx_runtime_1 = require("react/jsx-runtime");
const Fn_1 = require("./Fn");
function Modal(props) {
    const close = () => {
        (0, Fn_1.closeModal)(props.id);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "d-none", "data-toggle": "modal", id: `modalBtn-${props.id}`, "data-target": `#${props.id}`, children: "Launch demo modal" }), (0, jsx_runtime_1.jsx)("div", { className: "modal fade", id: props.id, tabIndex: -1, role: "dialog", "aria-labelledby": "exampleModalLabel", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("div", { className: "modal-dialog", role: "document", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsx)("h5", { className: "modal-title", id: "exampleModalLabel", children: props.title }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close", id: `modalBtnClose-${props.id}`, children: (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: "\u00D7" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "modal-body", children: props.children }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn btn-secondary", "data-dismiss": "modal", children: "Close" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn btn-primary", onClick: () => {
                                            if (props.confirmFunc)
                                                props.confirmFunc(close);
                                        }, children: "OK" })] })] }) }) })] }));
}

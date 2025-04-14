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
exports.default = Input;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Input.scss");
const Fn_1 = require("./Fn");
const I_1 = __importDefault(require("./I"));
function Input(props) {
    var _a, _b, _c;
    const [filteredData, setFilteredData] = (0, react_1.useState)([]);
    function showPassword() {
        const input = document.getElementById(props.id);
        if ((input === null || input === void 0 ? void 0 : input.type) === "password") {
            input.type = "text";
        }
        else {
            input.type = "password";
        }
    }
    (0, react_1.useEffect)(() => {
        if (props.type === "select") {
            if (props.value)
                (0, Fn_1.setVal)(props.id, props.value);
        }
        else {
            (0, Fn_1.setVal)(props.id, props.value || "");
        }
    }, [props.value]);
    return props.type === "text" ||
        props.type === "number" ||
        props.type === "time" ||
        props.type === "password" ||
        props.type === "date" ? ((0, jsx_runtime_1.jsxs)("div", { style: { position: "relative" }, className: `mb-${(props === null || props === void 0 ? void 0 : props.mb) && props.mb >= 0 ? props.mb : 3}`, children: [props.label ? ((0, jsx_runtime_1.jsx)("div", { className: props.labelClass, children: (0, jsx_runtime_1.jsx)("label", { htmlFor: `${props.id}`, children: props.label }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [props.iconBefore ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "input-group-prepend", children: (0, jsx_runtime_1.jsx)("span", { className: "input-group-text", children: (0, jsx_runtime_1.jsx)(I_1.default, { c: props.iconBefore }) }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("input", { style: Object.assign({}, props.style), type: props.type, className: "form-control", placeholder: props.placeholder, autoComplete: "off", id: props.id, onBlur: props.onBlur, readOnly: props.readonly, onPaste: (e) => {
                            const ev = e;
                            if (props.onPaste)
                                props.onPaste(ev);
                        }, onFocus: () => {
                            if (props.dataShowAll) {
                                setFilteredData(props.data || []);
                            }
                        }, onChange: (e) => {
                            var _a;
                            /** @type {{ value: string }} */
                            const target = e.target;
                            const val = /** @type {string} */ target.value;
                            (0, Fn_1.setVal)(props.id, val);
                            if (val === "") {
                                if (props.dataShowAll) {
                                    setFilteredData(props.data || []);
                                }
                                else {
                                    setFilteredData([]);
                                }
                            }
                            else {
                                setFilteredData((_a = props.data) === null || _a === void 0 ? void 0 : _a.filter((item) => item.toLowerCase().includes(target.value.toLowerCase())));
                            }
                        } }), props.type === "password" ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "input-group-append showPasswordWrapper", onClick: showPassword, children: (0, jsx_runtime_1.jsx)("span", { className: "input-group-text", children: (0, jsx_runtime_1.jsx)("i", { className: `bi-eye-fill` }) }) }) })) : props.iconAfter ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "input-group-append", children: (0, jsx_runtime_1.jsx)("span", { className: "input-group-text", children: (0, jsx_runtime_1.jsx)(I_1.default, { c: props.iconAfter }) }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }), filteredData && filteredData.length > 0 ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "bg-light w-100 border", style: {
                        position: "absolute",
                        maxHeight: 200,
                        overflowY: "scroll",
                        zIndex: 999,
                    }, children: filteredData.map((item, i) => {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)("div", { onClick: () => {
                                if (props.multiSelect) {
                                    const val = (0, Fn_1.getVal)(props.id);
                                    const vals = val.split(",");
                                    if (vals.length === 1) {
                                        (0, Fn_1.setVal)(props.id, `${item},`);
                                    }
                                    else {
                                        //pop the last item
                                        vals.pop();
                                        vals.push(item);
                                        (0, Fn_1.setVal)(props.id, vals.join(",") + ",");
                                    }
                                }
                                else {
                                    (0, Fn_1.setVal)(props.id, item);
                                }
                                setFilteredData([]);
                            }, className: "autoInputChildren p-2", children: ((_a = props.dataLabels) === null || _a === void 0 ? void 0 : _a[i]) || item }, i));
                    }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), props.description ? ((0, jsx_runtime_1.jsx)("div", { className: "fs-08 mt-1", dangerouslySetInnerHTML: { __html: props.description } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })) : props.type === "radio" ? ((0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [props.label ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "mb-1", children: props.label }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (_a = props.data) === null || _a === void 0 ? void 0 : _a.map((item, i) => {
                var _a;
                return ((0, jsx_runtime_1.jsxs)("div", { className: "form-check", children: [(0, jsx_runtime_1.jsx)("input", { className: "form-check-input", type: "radio", name: props.id, id: `radio-${props.id}-${(0, Fn_1.slugify)(item)}`, value: item, checked: props.value === item, onChange: props.onChange }), (0, jsx_runtime_1.jsx)("label", { style: { cursor: "pointer" }, className: "form-check-label", htmlFor: `radio-${props.id}-${(0, Fn_1.slugify)(item)}`, children: ((_a = props.dataLabels) === null || _a === void 0 ? void 0 : _a[i]) ? ((0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: props.dataLabels[i] } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: item })) })] }, i));
            }), props.description ? ((0, jsx_runtime_1.jsx)("div", { className: "fs-08 mt-1", dangerouslySetInnerHTML: { __html: props.description } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })) : props.type === "textarea" ? ((0, jsx_runtime_1.jsxs)("div", { className: "form-group", style: { display: props.inline ? "inline-block" : "block" }, children: [props.label ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("label", { className: "mb-1", htmlFor: props.id, children: props.label }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("textarea", { onBlur: props.onBlur, className: "form-control", id: props.id, rows: props.rows || 3, style: Object.assign({}, props.style), placeholder: props.placeholder, readOnly: props.readonly, onPaste: (e) => {
                    if (props.onPaste)
                        props.onPaste(e);
                }, children: props.value }), props.description ? ((0, jsx_runtime_1.jsx)("div", { className: "fs-08 mt-1", dangerouslySetInnerHTML: { __html: props.description } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })) : props.type === "checkbox" ? ((0, jsx_runtime_1.jsxs)("div", { className: `mb-${props.mb && props.mb >= 0 ? props.mb : 3}`, children: [props.label ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "mb-1", children: props.label }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (_b = props.data) === null || _b === void 0 ? void 0 : _b.map((item, i) => {
                var _a, _b;
                return ((0, jsx_runtime_1.jsxs)("div", { className: "form-check", children: [(0, jsx_runtime_1.jsx)("input", { className: "form-check-input", type: "checkbox", name: `checkbox-${props.id}-${(0, Fn_1.slugify)(item)}`, id: `checkbox-${props.id}-${(0, Fn_1.slugify)(item)}`, value: item, checked: props.isChecked || ((_a = props.checked) === null || _a === void 0 ? void 0 : _a.includes(item)), onChange: props.onChange }), (0, jsx_runtime_1.jsx)("label", { className: "form-check-label", htmlFor: `checkbox-${props.id}-${(0, Fn_1.slugify)(item)}`, children: ((_b = props.dataLabels) === null || _b === void 0 ? void 0 : _b[i]) || item })] }, i));
            }), props.description ? ((0, jsx_runtime_1.jsx)("div", { className: "fs-08 mt-1", dangerouslySetInnerHTML: { __html: props.description } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })) : props.type === "uploadimage" ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { style: { position: "relative" }, className: `mb-${props.mb && props.mb >= 0 ? props.mb : 3}`, children: [props.label ? ((0, jsx_runtime_1.jsx)("div", { className: props.labelClass, children: (0, jsx_runtime_1.jsx)("label", { htmlFor: `${props.id}`, children: props.label }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [props.iconBefore ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "input-group-prepend", children: (0, jsx_runtime_1.jsx)("span", { className: "input-group-text", children: (0, jsx_runtime_1.jsx)(I_1.default, { c: props.iconBefore }) }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("input", { style: Object.assign({}, props.style), type: props.type, className: "form-control", placeholder: props.placeholder, autoComplete: "off", id: props.id, readOnly: true }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group-append", children: [(0, jsx_runtime_1.jsx)("button", { className: "input-group-text btn-danger btn", onClick: () => {
                                        const s = document.getElementById(props.id);
                                        s.value = "";
                                        (0, Fn_1.setVal)(props.id, "");
                                    }, children: (0, jsx_runtime_1.jsx)(I_1.default, { c: "trash" }) }), (0, jsx_runtime_1.jsxs)("button", { className: "input-group-text btn-primary btn", onClick: () => {
                                        const input = document.getElementById(`${props.id}-selector`);
                                        input.click();
                                    }, children: [(0, jsx_runtime_1.jsx)("input", { type: "file", className: "d-none", id: `${props.id}-selector`, onChange: (e) => __awaiter(this, void 0, void 0, function* () {
                                                (0, Fn_1.setVal)(props.id, "Uploading...");
                                                const target = e.target;
                                                if (!target) {
                                                    (0, Fn_1.setVal)(props.id, "");
                                                    return;
                                                }
                                                const file = target.files[0];
                                                const ext = file.name.split(".").pop();
                                                const filename = `${props.id}-${Date.now()}.${ext}`;
                                                yield fetch(`https://admin.bimasoft.web.id/?cbtindex=1&_=/bunnys3/add&filekey=${filename}`, {
                                                    headers: {
                                                        "Content-Type": "application/octet-stream",
                                                        Accept: "application/json",
                                                    },
                                                    method: "POST",
                                                    body: file,
                                                });
                                                (0, Fn_1.setVal)(props.id, `https://bima-s3.b-cdn.net/${filename}`);
                                            }) }), (0, jsx_runtime_1.jsx)(I_1.default, { c: "upload" }), " ", (0, jsx_runtime_1.jsx)("span", { className: "ml-2", children: "Upload" })] })] })] }), props.description ? ((0, jsx_runtime_1.jsx)("div", { className: "fs-08 mt-1", dangerouslySetInnerHTML: { __html: props.description } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }) })) : props.type === "select" ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { style: { position: "relative" }, className: `mb-${props.mb && props.mb >= 0 ? props.mb : 3}`, children: [props.label ? ((0, jsx_runtime_1.jsx)("div", { className: props.labelClass, children: (0, jsx_runtime_1.jsx)("label", { htmlFor: `${props.id}`, children: props.label }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [props.iconBefore ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "input-group-prepend", children: (0, jsx_runtime_1.jsx)("span", { className: "input-group-text", children: (0, jsx_runtime_1.jsx)(I_1.default, { c: props.iconBefore }) }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("select", { className: "form-control", id: props.id, children: (_c = props.data) === null || _c === void 0 ? void 0 : _c.map((item, i) => {
                                var _a;
                                return ((0, jsx_runtime_1.jsx)("option", { value: item, children: ((_a = props.dataLabels) === null || _a === void 0 ? void 0 : _a[i]) || item }, item));
                            }) }), props.iconAfter ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "input-group-append", children: (0, jsx_runtime_1.jsx)("span", { className: "input-group-text", children: (0, jsx_runtime_1.jsx)(I_1.default, { c: props.iconAfter }) }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }), props.description ? ((0, jsx_runtime_1.jsx)("div", { className: "mt-1 ml-2", style: { fontSize: ".8rem" }, dangerouslySetInnerHTML: { __html: props.description } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
}

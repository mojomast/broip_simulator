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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const ink_spinner_1 = __importDefault(require("ink-spinner"));
const technobabble_1 = require("../utils/technobabble");
const SystemMonitor = ({ onReturn }) => {
    const [status, setStatus] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    const [waitingForInput, setWaitingForInput] = (0, react_1.useState)(false);
    const [inputBuffer, setInputBuffer] = (0, react_1.useState)('');
    const [isActive, setIsActive] = (0, react_1.useState)(true);
    const [waitingForReturn, setWaitingForReturn] = (0, react_1.useState)(false);
    (0, ink_1.useInput)((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }
        if (input.toLowerCase() === 'x' && isActive) {
            setIsActive(false);
            setError('PERCOLATION_MANUALLY_TERMINATED');
            addStatus('EMERGENCY CHAMBER CLEAR ACTIVATED');
            setWaitingForReturn(true);
            return;
        }
        if (waitingForInput && isActive) {
            if (key.return) {
                handleErrorResolution();
            }
            else {
                setInputBuffer(prev => prev + input);
            }
        }
    });
    const handleErrorResolution = () => {
        setWaitingForInput(false);
        if ((0, technobabble_1.shouldErrorResolve)()) {
            addStatus('CHAMBER_CLEARED: Manual override accepted');
            setError(null);
        }
        else {
            addStatus('BLOCKAGE_PERSISTS: Override rejected - chamber contamination detected');
            setTimeout(triggerRandomError, 2000);
        }
        setInputBuffer('');
    };
    const addStatus = (message) => {
        setStatus(prev => [...prev.slice(-8), message]);
    };
    const triggerRandomError = () => {
        if (!isActive)
            return;
        const errorMsg = (0, technobabble_1.generateErrorMessage)();
        setError(errorMsg);
        addStatus(`PERCOLATION_ALERT: ${errorMsg}`);
        setWaitingForInput(true);
    };
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            if (!error && isActive) {
                addStatus((0, technobabble_1.generateTechnicalPhrase)());
                if (Math.random() < 0.2) {
                    triggerRandomError();
                }
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [error, isActive]);
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" },
                '[',
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "BROIP PERCOLATION MONITOR v4.20"),
                ']')),
        status.map((line, i) => (react_1.default.createElement(ink_1.Box, { key: i },
            react_1.default.createElement(ink_1.Text, { color: "green" },
                "[",
                new Date().toISOString(),
                "] "),
            react_1.default.createElement(ink_1.Text, { color: "cyan" }, line)))),
        error && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: "red", bold: true }, `>>> PERCOLATION ERROR: ${error}`),
            react_1.default.createElement(ink_1.Text, { color: "yellow" }, waitingForInput && !waitingForReturn ? (react_1.default.createElement(react_1.default.Fragment, null,
                "MANUAL CLEAR REQUIRED - Enter chamber reset code: ",
                inputBuffer,
                "_")) : (react_1.default.createElement(react_1.default.Fragment, null, "Analyzing blockage vectors..."))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: "green" },
                react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
            react_1.default.createElement(ink_1.Text, null,
                " ",
                (0, technobabble_1.getRandomLoadingPhrase)())),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: waitingForReturn ? "yellow" : "cyan" }, waitingForReturn ? "Press any key to return to menu" : "Press 'x' to emergency clear"))));
};
exports.default = SystemMonitor;

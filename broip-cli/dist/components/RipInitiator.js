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
const RipInitiator = ({ onReturn }) => {
    const [ripState, setRipState] = (0, react_1.useState)('CHAMBER_READY');
    const [subProcess, setSubProcess] = (0, react_1.useState)('');
    const [errorState, setErrorState] = (0, react_1.useState)(null);
    const [userInput, setUserInput] = (0, react_1.useState)('');
    const [requiresInput, setRequiresInput] = (0, react_1.useState)(false);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [isActive, setIsActive] = (0, react_1.useState)(true);
    const [waitingForReturn, setWaitingForReturn] = (0, react_1.useState)(false);
    (0, ink_1.useInput)((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }
        if (input.toLowerCase() === 'x' && isActive) {
            setIsActive(false);
            setRipState('CHAMBER_CLEARED');
            setErrorState('MANUAL_CLEAR_ACTIVATED');
            setWaitingForReturn(true);
            return;
        }
        if (requiresInput && isActive) {
            if (key.return) {
                handleUserInput();
            }
            else {
                setUserInput(prev => prev + input);
            }
        }
    });
    const handleUserInput = () => {
        setRequiresInput(false);
        if ((0, technobabble_1.shouldErrorResolve)()) {
            setErrorState(null);
            setRipState('REPACKING_BOWL');
            setProgress(0);
        }
        else {
            const newError = (0, technobabble_1.generateErrorMessage)();
            setErrorState(newError);
            setRipState('RIP_FAILED');
            setUserInput('');
            setTimeout(() => setRequiresInput(true), 2000);
        }
    };
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            if (!errorState && isActive) {
                setSubProcess((0, technobabble_1.generateTechnicalPhrase)());
                setProgress(prev => {
                    const next = prev + Math.random() * 10;
                    if (next >= 100) {
                        if (Math.random() < 0.3) {
                            setErrorState((0, technobabble_1.generateErrorMessage)());
                            setRequiresInput(true);
                            return 0;
                        }
                        return 0;
                    }
                    return next;
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [errorState, isActive]);
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP CHAMBER CONTROL v4.20"),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, { color: "green" },
                react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
            react_1.default.createElement(ink_1.Text, null,
                " Chamber Status: ",
                ripState)),
        react_1.default.createElement(ink_1.Text, { color: "yellow" },
            "Milk Level: [",
            '\u2588'.repeat(Math.floor(progress / 5)),
            '_'.repeat(20 - Math.floor(progress / 5)),
            "] ",
            Math.floor(progress),
            "%"),
        react_1.default.createElement(ink_1.Text, { dimColor: true }, subProcess),
        errorState && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: "red", bold: true }, `!!! CHAMBER ALERT: ${errorState}`),
            requiresInput && !waitingForReturn && (react_1.default.createElement(ink_1.Text, { color: "yellow" },
                "Enter emergency clear sequence: ",
                userInput,
                "_")))),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: waitingForReturn ? "yellow" : "cyan" }, waitingForReturn ? "Press any key to return to menu" : "Press 'x' to clear chamber"))));
};
exports.default = RipInitiator;

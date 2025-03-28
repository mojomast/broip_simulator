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
const ink_select_input_1 = __importDefault(require("ink-select-input"));
const DiffusionConfig = ({ onReturn }) => {
    const [config, setConfig] = (0, react_1.useState)({
        percolationType: 'SINGLE',
        waterLevel: 50,
        iceNotches: 3,
        dragCoefficient: 1.0
    });
    const [selectedOption, setSelectedOption] = (0, react_1.useState)('type');
    const [waitingForReturn, setWaitingForReturn] = (0, react_1.useState)(false);
    (0, ink_1.useInput)((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }
        if (input.toLowerCase() === 'x') {
            setWaitingForReturn(true);
            return;
        }
        if (selectedOption !== 'type') {
            if (key.leftArrow) {
                adjustValue(selectedOption, -1);
            }
            else if (key.rightArrow) {
                adjustValue(selectedOption, 1);
            }
        }
    });
    const adjustValue = (option, delta) => {
        setConfig(prev => {
            switch (option) {
                case 'water':
                    return { ...prev, waterLevel: Math.max(0, Math.min(100, prev.waterLevel + delta * 5)) };
                case 'ice':
                    return { ...prev, iceNotches: Math.max(0, Math.min(6, prev.iceNotches + delta)) };
                case 'drag':
                    return { ...prev, dragCoefficient: Math.max(0.1, Math.min(2.0, prev.dragCoefficient + delta * 0.1)) };
                default:
                    return prev;
            }
        });
    };
    const percolationTypes = [
        { label: 'Single Perc', value: 'SINGLE' },
        { label: 'Double Perc', value: 'DOUBLE' },
        { label: 'Triple Perc', value: 'TRIPLE' },
        { label: 'Honeycomb', value: 'HONEYCOMB' },
        { label: 'Tree Perc', value: 'TREE' },
        { label: 'Matrix', value: 'MATRIX' }
    ];
    const handlePercolationSelect = (item) => {
        setConfig(prev => ({ ...prev, percolationType: item.value }));
        setSelectedOption('water');
    };
    const renderBar = (value, max) => {
        const width = 20;
        const filled = Math.floor((value / max) * width);
        return `[${'|'.repeat(filled)}${'-'.repeat(width - filled)}]`;
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP DIFFUSION CONFIGURATION v4.20"),
        selectedOption === 'type' ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" }, "Select Percolation Type:"),
            react_1.default.createElement(ink_select_input_1.default, { items: percolationTypes, onSelect: handlePercolationSelect }))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Current Configuration:"),
            react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null,
                    "Percolation Type: ",
                    react_1.default.createElement(ink_1.Text, { color: "green" }, config.percolationType)),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Water Level: "),
                    react_1.default.createElement(ink_1.Text, { color: selectedOption === 'water' ? 'yellow' : 'cyan' },
                        renderBar(config.waterLevel, 100),
                        " ",
                        config.waterLevel,
                        "%")),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Ice Notches: "),
                    react_1.default.createElement(ink_1.Text, { color: selectedOption === 'ice' ? 'yellow' : 'cyan' },
                        renderBar(config.iceNotches, 6),
                        " ",
                        config.iceNotches,
                        "/6")),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Drag Coefficient: "),
                    react_1.default.createElement(ink_1.Text, { color: selectedOption === 'drag' ? 'yellow' : 'cyan' },
                        renderBar(config.dragCoefficient, 2),
                        " ",
                        config.dragCoefficient.toFixed(1)))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "cyan" }, "Use \u2190 \u2192 arrows to adjust values \u2022 Space to cycle options \u2022 X to finish")),
            waitingForReturn && (react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "Configuration saved! Press any key to return to menu")))))));
};
exports.default = DiffusionConfig;

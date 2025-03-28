"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const ink_select_input_1 = __importDefault(require("ink-select-input"));
const MainMenu = () => {
    const items = [
        {
            label: 'Rip Initiator (RI)',
            value: 'ri'
        },
        {
            label: 'Rip Receiver (RR)',
            value: 'rr'
        },
        {
            label: 'PCWD',
            value: 'pcwd'
        },
        {
            label: 'System Status',
            value: 'status'
        },
        {
            label: 'Exit',
            value: 'exit'
        }
    ];
    const handleSelect = (item) => {
        if (item.value === 'exit') {
            process.exit();
        }
        // Handle other menu selections
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "BROIP Simulation Terminal")),
        react_1.default.createElement(ink_select_input_1.default, { items: items, onSelect: handleSelect })));
};
exports.default = MainMenu;

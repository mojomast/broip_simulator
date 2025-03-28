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
const BowlStatus = ({ onReturn }) => {
    const [stats, setStats] = (0, react_1.useState)({
        totalRips: 0,
        avgMilkDensity: 0,
        peakPercolation: 0,
        crystalRating: 0,
        uptime: 0
    });
    const [recentRips, setRecentRips] = (0, react_1.useState)([]);
    const [waitingForReturn, setWaitingForReturn] = (0, react_1.useState)(false);
    (0, ink_1.useInput)((input) => {
        if (waitingForReturn || input.toLowerCase() === 'x') {
            onReturn();
        }
    });
    (0, react_1.useEffect)(() => {
        // Simulate receiving rip packets
        const interval = setInterval(() => {
            const newRip = {
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toISOString(),
                milkDensity: Math.random() * 100,
                crystalPurity: Math.random() * 100,
                percolationRate: Math.random() * 50 + 20,
                bowlStatus: Math.random() > 0.7 ? 'CACHED' : Math.random() > 0.5 ? 'PARTIALLY_CACHED' : 'FRESH',
                chamberTemp: Math.random() * 30 + 20
            };
            setRecentRips(prev => [...prev.slice(-4), newRip]);
            setStats(prev => ({
                totalRips: prev.totalRips + 1,
                avgMilkDensity: (prev.avgMilkDensity * prev.totalRips + newRip.milkDensity) / (prev.totalRips + 1),
                peakPercolation: Math.max(prev.peakPercolation, newRip.percolationRate),
                crystalRating: (prev.crystalRating + newRip.crystalPurity) / 2,
                uptime: prev.uptime + 1
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case 'FRESH': return 'green';
            case 'PARTIALLY_CACHED': return 'yellow';
            case 'CACHED': return 'red';
            default: return 'white';
        }
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP BOWL STATUS MONITOR v4.20"),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Global Statistics:"),
            react_1.default.createElement(ink_1.Box, { marginLeft: 2, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null,
                    "Total Rips Processed: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" }, stats.totalRips)),
                react_1.default.createElement(ink_1.Text, null,
                    "Average Milk Density: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" },
                        stats.avgMilkDensity.toFixed(2),
                        "%")),
                react_1.default.createElement(ink_1.Text, null,
                    "Peak Percolation Rate: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" },
                        stats.peakPercolation.toFixed(2),
                        " bps")),
                react_1.default.createElement(ink_1.Text, null,
                    "Crystal Quality Index: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" },
                        stats.crystalRating.toFixed(2),
                        "%")),
                react_1.default.createElement(ink_1.Text, null,
                    "System Uptime: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" },
                        stats.uptime,
                        "s")))),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Recent Rip Activity:"),
            react_1.default.createElement(ink_1.Box, { marginLeft: 2, flexDirection: "column" }, recentRips.map((rip, i) => (react_1.default.createElement(ink_1.Box, { key: i, flexDirection: "column", marginY: 1 },
                react_1.default.createElement(ink_1.Text, { dimColor: true },
                    "ID: ",
                    rip.id,
                    " \u2022 ",
                    new Date(rip.timestamp).toLocaleTimeString()),
                react_1.default.createElement(ink_1.Box, { marginLeft: 2, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, null,
                        "Bowl Status: ",
                        react_1.default.createElement(ink_1.Text, { color: getStatusColor(rip.bowlStatus) }, rip.bowlStatus)),
                    react_1.default.createElement(ink_1.Text, null,
                        "Milk Density: ",
                        react_1.default.createElement(ink_1.Text, { color: "yellow" },
                            rip.milkDensity.toFixed(2),
                            "%")),
                    react_1.default.createElement(ink_1.Text, null,
                        "Percolation Rate: ",
                        react_1.default.createElement(ink_1.Text, { color: "yellow" },
                            rip.percolationRate.toFixed(2),
                            " bps")),
                    react_1.default.createElement(ink_1.Text, null,
                        "Chamber Temp: ",
                        react_1.default.createElement(ink_1.Text, { color: "yellow" },
                            rip.chamberTemp.toFixed(1),
                            "\u00B0C")))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: "green" },
                react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
            react_1.default.createElement(ink_1.Text, null, " Monitoring bowl status... Press 'x' to return"))));
};
exports.default = BowlStatus;

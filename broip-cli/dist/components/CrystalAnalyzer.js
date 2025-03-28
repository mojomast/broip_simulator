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
const CrystalAnalyzer = ({ onReturn }) => {
    const [analyzing, setAnalyzing] = (0, react_1.useState)(true);
    const [waitingForReturn, setWaitingForReturn] = (0, react_1.useState)(false);
    const [analysis, setAnalysis] = (0, react_1.useState)(null);
    const [scanPhase, setScanPhase] = (0, react_1.useState)(0);
    (0, ink_1.useInput)((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }
        if (input.toLowerCase() === 'x') {
            setWaitingForReturn(true);
        }
    });
    (0, react_1.useEffect)(() => {
        if (!analyzing)
            return;
        const interval = setInterval(() => {
            setScanPhase(prev => {
                if (prev >= 100) {
                    setAnalyzing(false);
                    clearInterval(interval);
                    setAnalysis({
                        density: Math.random() * 100,
                        clarity: Math.random() * 100,
                        structure: ['INDICA_DOMINANT', 'SATIVA_DOMINANT', 'HYBRID_BALANCED'][Math.floor(Math.random() * 3)],
                        potency: Math.random() * 100,
                        recommendation: [
                            'OPTIMAL FOR IMMEDIATE CONSUMPTION',
                            'REQUIRES ADDITIONAL CURING',
                            'PEAK CRYSTALLIZATION ACHIEVED',
                            'RECOMMEND HUMIDITY ADJUSTMENT'
                        ][Math.floor(Math.random() * 4)]
                    });
                    return prev;
                }
                return prev + 10;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [analyzing]);
    const getPhaseText = () => {
        const phases = [
            'INITIALIZING CRYSTAL MATRIX',
            'CALIBRATING TRICHOME SENSORS',
            'ANALYZING MOLECULAR STRUCTURE',
            'CALCULATING DENSITY RATIOS',
            'MEASURING POTENCY VECTORS',
            'EVALUATING TERPENE PROFILES',
            'PROCESSING CRYSTALLIZATION PATTERNS',
            'GENERATING RECOMMENDATIONS',
            'FINALIZING ANALYSIS',
            'COMPILING RESULTS'
        ];
        return phases[Math.floor(scanPhase / 10)];
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP CRYSTAL ANALYSIS MATRIX v4.20"),
        analyzing ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                react_1.default.createElement(ink_1.Text, null,
                    " ",
                    getPhaseText())),
            react_1.default.createElement(ink_1.Text, { color: "yellow" },
                "Analysis Progress: [",
                '\u2588'.repeat(Math.floor(scanPhase / 5)),
                '_'.repeat(20 - Math.floor(scanPhase / 5)),
                "] ",
                scanPhase,
                "%"),
            react_1.default.createElement(ink_1.Text, { dimColor: true }, (0, technobabble_1.generateTechnicalPhrase)()))) : analysis && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { color: "cyan" }, '='.repeat(50)),
            react_1.default.createElement(ink_1.Text, { bold: true }, "CRYSTAL ANALYSIS REPORT"),
            react_1.default.createElement(ink_1.Text, { color: "cyan" }, '='.repeat(50)),
            react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null,
                    "Density Rating: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" },
                        analysis.density.toFixed(2),
                        "%")),
                react_1.default.createElement(ink_1.Text, null,
                    "Crystal Clarity: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" },
                        analysis.clarity.toFixed(2),
                        "%")),
                react_1.default.createElement(ink_1.Text, null,
                    "Structure Type: ",
                    react_1.default.createElement(ink_1.Text, { color: "green" }, analysis.structure)),
                react_1.default.createElement(ink_1.Text, null,
                    "Potency Index: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" },
                        analysis.potency.toFixed(2),
                        "%")),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "RECOMMENDATION: "),
                    react_1.default.createElement(ink_1.Text, { color: "yellow" }, analysis.recommendation))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: waitingForReturn ? "yellow" : "cyan" }, waitingForReturn ?
                "Press any key to return to menu" :
                analyzing ?
                    "Analysis in progress..." :
                    "Press 'x' to return to menu"))));
};
exports.default = CrystalAnalyzer;

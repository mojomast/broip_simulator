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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const UserContext_1 = require("../utils/UserContext");
const AutoCarb = ({ onReturn }) => {
    const { preferences } = (0, UserContext_1.useUser)();
    const [autoCarbEnabled, setAutoCarbEnabled] = (0, react_1.useState)(true);
    const [sensorData, setSensorData] = (0, react_1.useState)({
        thcLevel: 0,
        userVitalSigns: {
            heartRate: 60,
            breathingRate: 12,
        }
    });
    const [carbLevel, setCarbLevel] = (0, react_1.useState)(50);
    // Simulate sensor data updates
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setSensorData(prev => ({
                thcLevel: Math.min(100, prev.thcLevel + Math.random() * 5),
                userVitalSigns: {
                    heartRate: Math.max(50, Math.min(120, prev.userVitalSigns.heartRate + (Math.random() - 0.5) * 10)),
                    breathingRate: Math.max(8, Math.min(20, prev.userVitalSigns.breathingRate + (Math.random() - 0.5) * 4)),
                }
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    // Adjust carb level based on sensor data
    (0, react_1.useEffect)(() => {
        let newCarbLevel = 50;
        // Example logic: adjust carb level based on THC and heart rate
        if (sensorData.thcLevel > 70 && sensorData.userVitalSigns.heartRate > 90) {
            newCarbLevel = 20; // Reduce carb to mitigate potential over-intoxication
        }
        else if (sensorData.thcLevel < 30 && sensorData.userVitalSigns.heartRate < 70) {
            newCarbLevel = 80; // Increase carb to enhance the experience
        }
        setCarbLevel(newCarbLevel);
    }, [sensorData]);
    const toggleAutoCarb = () => {
        setAutoCarbEnabled(!autoCarbEnabled);
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "AI-Powered Auto-Carb")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Intelligently adjusts carb level for optimal user safety and experience")),
        react_1.default.createElement(ink_1.Box, { borderStyle: "single", padding: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Auto-Carb: ",
                autoCarbEnabled ? react_1.default.createElement(ink_1.Text, { color: "green" }, "Enabled") : react_1.default.createElement(ink_1.Text, { color: "red" }, "Disabled")),
            react_1.default.createElement(ink_1.Text, null,
                "Current Carb Level: ",
                react_1.default.createElement(ink_1.Text, { color: "yellow" },
                    carbLevel,
                    "%")),
            react_1.default.createElement(ink_1.Text, null,
                "THC Level: ",
                sensorData.thcLevel.toFixed(1)),
            react_1.default.createElement(ink_1.Text, null,
                "Heart Rate: ",
                sensorData.userVitalSigns.heartRate.toFixed(0),
                " bpm"),
            react_1.default.createElement(ink_1.Text, null,
                "Breathing Rate: ",
                sensorData.userVitalSigns.breathingRate.toFixed(0),
                " breaths/min")),
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, { onPress: toggleAutoCarb }, "Toggle Auto-Carb")),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Text, { onPress: onReturn }, "Return to Main Menu"))));
};
exports.default = AutoCarb;

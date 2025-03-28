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
const ink_spinner_1 = __importDefault(require("ink-spinner"));
const UserContext_1 = require("../utils/UserContext");
const NeuralSingularityRipping = ({ onReturn }) => {
    const { preferences } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [neuralConnection, setNeuralConnection] = (0, react_1.useState)({
        id: 'neural-link-1',
        status: 'DISCONNECTED',
        signalStrength: 0,
        latency: 0,
        syncLevel: 0
    });
    const [brainwavePatterns, setBrainwavePatterns] = (0, react_1.useState)([]);
    const [selectedPattern, setSelectedPattern] = (0, react_1.useState)(null);
    const [isCalibrating, setIsCalibrating] = (0, react_1.useState)(false);
    const [calibrationProgress, setCalibrationProgress] = (0, react_1.useState)(0);
    const [sessionActive, setSessionActive] = (0, react_1.useState)(false);
    const [sessionIntensity, setSessionIntensity] = (0, react_1.useState)(0);
    const [sessionDuration, setSessionDuration] = (0, react_1.useState)(0);
    const [egoLevel, setEgoLevel] = (0, react_1.useState)(100);
    const [thoughtStream, setThoughtStream] = (0, react_1.useState)([]);
    const [safetyProtocols, setSafetyProtocols] = (0, react_1.useState)({
        egoProtection: true,
        realityAnchor: true,
        autoTerminate: true,
        intensityLimit: 70
    });
    // Initialize brainwave patterns
    (0, react_1.useEffect)(() => {
        const initialPatterns = [
            {
                id: 'alpha-wave',
                name: 'Alpha Relaxation',
                description: 'Gentle relaxation with mild euphoria and creativity enhancement',
                intensity: 30,
                frequency: 8.5,
                synchronicity: 65,
                effects: ['Relaxation', 'Mild Euphoria', 'Creativity', 'Stress Reduction'],
                riskLevel: 'LOW'
            },
            {
                id: 'theta-deep',
                name: 'Theta Dreamscape',
                description: 'Deep meditative state with vivid imagery and enhanced sensory perception',
                intensity: 50,
                frequency: 6.0,
                synchronicity: 75,
                effects: ['Vivid Imagery', 'Time Distortion', 'Sensory Enhancement', 'Introspection'],
                riskLevel: 'MODERATE'
            },
            {
                id: 'gamma-burst',
                name: 'Gamma Insight',
                description: 'Heightened awareness and cognitive enhancement with profound insights',
                intensity: 70,
                frequency: 40.0,
                synchronicity: 85,
                effects: ['Cognitive Enhancement', 'Pattern Recognition', 'Insight Generation', 'Information Processing'],
                riskLevel: 'HIGH'
            },
            {
                id: 'delta-void',
                name: 'Delta Void',
                description: 'Profound disconnection from physical reality with ego dissolution',
                intensity: 90,
                frequency: 2.0,
                synchronicity: 95,
                effects: ['Ego Dissolution', 'Reality Detachment', 'Cosmic Consciousness', 'Transcendence'],
                riskLevel: 'EXTREME'
            },
            {
                id: 'quantum-entangle',
                name: 'Quantum Entanglement',
                description: 'Experimental pattern that synchronizes consciousness across multiple dimensions',
                intensity: 100,
                frequency: 108.0,
                synchronicity: 99,
                effects: ['Multidimensional Awareness', 'Time Perception Collapse', 'Universal Connectivity', 'Existence Beyond Form'],
                riskLevel: 'EXTREME'
            }
        ];
        setBrainwavePatterns(initialPatterns);
    }, []);
    const menuItems = [
        {
            label: '🧠 Calibrate Neural Interface',
            value: 'calibrate'
        },
        {
            label: '🌊 Brainwave Pattern Library',
            value: 'patterns'
        },
        {
            label: '🚀 Begin Neural Rip Session',
            value: 'session'
        },
        {
            label: '⚙️ Safety Protocols & Settings',
            value: 'settings'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else if (item.value === 'calibrate') {
            setActiveScreen('CALIBRATE');
        }
        else if (item.value === 'patterns') {
            setActiveScreen('PATTERNS');
        }
        else if (item.value === 'session') {
            if (neuralConnection.status === 'SYNCED' || neuralConnection.status === 'TRANSCENDING') {
                setActiveScreen('ACTIVE_SESSION');
            }
            else {
                // Cannot start session without calibration
                setActiveScreen('CALIBRATE');
            }
        }
        else if (item.value === 'settings') {
            setActiveScreen('SETTINGS');
        }
    };
    const calibrateNeuralInterface = () => {
        setIsCalibrating(true);
        setCalibrationProgress(0);
        // Simulate calibration process
        const interval = setInterval(() => {
            setCalibrationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishCalibration();
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
    };
    const finishCalibration = () => {
        // Update neural connection status
        setNeuralConnection({
            ...neuralConnection,
            status: 'SYNCED',
            signalStrength: Math.floor(Math.random() * 20) + 80,
            latency: Math.floor(Math.random() * 10) + 1,
            syncLevel: Math.floor(Math.random() * 15) + 85 // 85-100%
        });
        setIsCalibrating(false);
    };
    const selectBrainwavePattern = (patternId) => {
        setSelectedPattern(patternId);
        // Update neural connection with selected pattern
        setNeuralConnection(prev => ({
            ...prev,
            activePattern: patternId,
            status: patternId === 'quantum-entangle' || patternId === 'delta-void' ? 'TRANSCENDING' : 'SYNCED'
        }));
    };
    const startNeuralSession = () => {
        if (!selectedPattern)
            return;
        const pattern = brainwavePatterns.find(p => p.id === selectedPattern);
        if (!pattern)
            return;
        setSessionActive(true);
        setSessionDuration(0);
        setSessionIntensity(0);
        setEgoLevel(100);
        setThoughtStream([]);
        // Start session timers and effects
        const durationInterval = setInterval(() => {
            setSessionDuration(prev => prev + 1);
        }, 1000);
        const intensityInterval = setInterval(() => {
            setSessionIntensity(prev => {
                const targetIntensity = Math.min(pattern.intensity, safetyProtocols.intensityLimit);
                if (prev >= targetIntensity) {
                    clearInterval(intensityInterval);
                    return targetIntensity;
                }
                return prev + 2;
            });
        }, 500);
        const egoInterval = setInterval(() => {
            setEgoLevel(prev => {
                // Ego dissolution based on pattern intensity and safety protocols
                const newLevel = safetyProtocols.egoProtection ?
                    Math.max(40, prev - (pattern.intensity / 100)) :
                    Math.max(0, prev - (pattern.intensity / 50));
                // Auto-terminate if ego level gets too low and safety is on
                if (newLevel < 20 && safetyProtocols.autoTerminate) {
                    endNeuralSession();
                    clearInterval(egoInterval);
                    return 20;
                }
                return newLevel;
            });
        }, 2000);
        // Generate thought stream
        const thoughtInterval = setInterval(() => {
            const thoughts = [
                "Consciousness expanding beyond physical form...",
                "Perceiving reality through quantum fluctuations...",
                "Time is merely a construct of limited perception...",
                "All existence is interconnected through vibration...",
                "The self is an illusion of separated consciousness...",
                "Awareness extends beyond the confines of the brain...",
                "Information exists independent of physical substrate...",
                "Reality is a consensus hallucination...",
                "The universe observes itself through us...",
                "Boundaries between mind and environment dissolving..."
            ];
            setThoughtStream(prev => {
                const newThought = thoughts[Math.floor(Math.random() * thoughts.length)];
                const updatedStream = [...prev, newThought];
                return updatedStream.slice(-5); // Keep only last 5 thoughts
            });
        }, 3000);
        // Store intervals for cleanup
        return () => {
            clearInterval(durationInterval);
            clearInterval(intensityInterval);
            clearInterval(egoInterval);
            clearInterval(thoughtInterval);
        };
    };
    const endNeuralSession = () => {
        setSessionActive(false);
        // Reset neural connection if it was transcending
        if (neuralConnection.status === 'TRANSCENDING') {
            setNeuralConnection(prev => ({
                ...prev,
                status: 'SYNCED'
            }));
        }
        // Return to menu after session ends
        setActiveScreen('MENU');
    };
    const toggleSafetyProtocol = (protocol) => {
        setSafetyProtocols(prev => ({
            ...prev,
            [protocol]: !prev[protocol]
        }));
    };
    const adjustIntensityLimit = (amount) => {
        setSafetyProtocols(prev => ({
            ...prev,
            intensityLimit: Math.max(10, Math.min(100, prev.intensityLimit + amount))
        }));
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'DISCONNECTED': return 'red';
            case 'CALIBRATING': return 'yellow';
            case 'CONNECTED': return 'blue';
            case 'SYNCED': return 'green';
            case 'TRANSCENDING': return 'magenta';
            default: return 'white';
        }
    };
    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'LOW': return 'green';
            case 'MODERATE': return 'yellow';
            case 'HIGH': return 'red';
            case 'EXTREME': return 'magenta';
            default: return 'white';
        }
    };
    // Render the Calibration screen
    const renderCalibrateScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Neural Interface Calibration")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Status: ",
                react_1.default.createElement(ink_1.Text, { color: getStatusColor(neuralConnection.status) }, neuralConnection.status))),
        isCalibrating ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "cyan" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Calibrating neural interface..."),
            react_1.default.createElement(ink_1.Text, null,
                "Progress: ",
                calibrationProgress,
                "%"),
            react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < calibrationProgress / 2 ? '█' : '░').join(''))),
            react_1.default.createElement(ink_1.Text, null, "Establishing direct brain-to-bong connection..."),
            calibrationProgress > 30 && react_1.default.createElement(ink_1.Text, null, "Mapping neural pathways..."),
            calibrationProgress > 60 && react_1.default.createElement(ink_1.Text, null, "Synchronizing consciousness wavelengths..."),
            calibrationProgress > 90 && react_1.default.createElement(ink_1.Text, null, "Finalizing quantum entanglement..."))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 }, neuralConnection.status === 'DISCONNECTED' ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Text, null, "Your neural interface requires calibration before use."),
            react_1.default.createElement(ink_1.Text, null, "This process will establish a direct connection between"),
            react_1.default.createElement(ink_1.Text, null, "your consciousness and the BROIP system."),
            react_1.default.createElement(ink_1.Box, { marginY: 2 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "cyan", paddingX: 2, paddingY: 1, onPress: calibrateNeuralInterface },
                    react_1.default.createElement(ink_1.Text, { color: "black" }, "Begin Calibration"))))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Text, { bold: true }, "Neural Link Established"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Signal Strength: ",
                    react_1.default.createElement(ink_1.Text, { color: "green" },
                        neuralConnection.signalStrength,
                        "%")),
                react_1.default.createElement(ink_1.Text, null,
                    "Neural Latency: ",
                    react_1.default.createElement(ink_1.Text, { color: "green" },
                        neuralConnection.latency,
                        "ms")),
                react_1.default.createElement(ink_1.Text, null,
                    "Synchronization: ",
                    react_1.default.createElement(ink_1.Text, { color: "green" },
                        neuralConnection.syncLevel,
                        "%")),
                neuralConnection.activePattern && (react_1.default.createElement(ink_1.Text, null,
                    "Active Pattern: ",
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, brainwavePatterns.find(p => p.id === neuralConnection.activePattern)?.name || 'Unknown')))),
            react_1.default.createElement(ink_1.Box, { marginY: 2 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "cyan", paddingX: 2, paddingY: 1, onPress: calibrateNeuralInterface },
                    react_1.default.createElement(ink_1.Text, { color: "black" }, "Recalibrate"))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the Patterns screen
    const renderPatternsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Brainwave Pattern Library")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Select a brainwave pattern to load into your neural interface")),
        brainwavePatterns.map((pattern, index) => (react_1.default.createElement(ink_1.Box, { key: pattern.id, flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1, borderColor: selectedPattern === pattern.id ? 'cyan' : undefined },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, pattern.name),
                react_1.default.createElement(ink_1.Text, null,
                    " - Risk Level: ",
                    react_1.default.createElement(ink_1.Text, { color: getRiskLevelColor(pattern.riskLevel) }, pattern.riskLevel))),
            react_1.default.createElement(ink_1.Text, null, pattern.description),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Intensity: ",
                    pattern.intensity,
                    "% | Frequency: ",
                    pattern.frequency,
                    "Hz | Sync: ",
                    pattern.synchronicity,
                    "%")),
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, null,
                    "Effects: ",
                    pattern.effects.join(', '))),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: selectedPattern === pattern.id ? "green" : "cyan", paddingX: 2, paddingY: 1, onPress: () => selectBrainwavePattern(pattern.id) },
                    react_1.default.createElement(ink_1.Text, { color: "black" }, selectedPattern === pattern.id ? "Selected" : "Select Pattern")))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the Active Session screen
    const renderActiveSessionScreen = () => {
        const pattern = brainwavePatterns.find(p => p.id === selectedPattern);
        if (!pattern) {
            return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null, "Error: No brainwave pattern selected"),
                react_1.default.createElement(ink_1.Box, { marginTop: 2 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                        react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('PATTERNS') }, "Select Pattern")))));
        }
        if (!sessionActive) {
            return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Neural Rip Session")),
                react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
                    react_1.default.createElement(ink_1.Text, { bold: true },
                        "Selected Pattern: ",
                        react_1.default.createElement(ink_1.Text, { color: "cyan" }, pattern.name)),
                    react_1.default.createElement(ink_1.Text, null,
                        "Risk Level: ",
                        react_1.default.createElement(ink_1.Text, { color: getRiskLevelColor(pattern.riskLevel) }, pattern.riskLevel)),
                    react_1.default.createElement(ink_1.Text, null,
                        "Description: ",
                        pattern.description)),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "This will initiate a direct neural rip experience using"),
                    react_1.default.createElement(ink_1.Text, null, "the selected brainwave pattern. Your consciousness will"),
                    react_1.default.createElement(ink_1.Text, null, "interface directly with the BROIP system, bypassing"),
                    react_1.default.createElement(ink_1.Text, null, "physical inhalation entirely.")),
                pattern.riskLevel === 'HIGH' || pattern.riskLevel === 'EXTREME' ? (react_1.default.createElement(ink_1.Box, { marginY: 1, borderStyle: "single", borderColor: "red", paddingX: 2, paddingY: 1 },
                    react_1.default.createElement(ink_1.Text, { color: "red", bold: true }, "WARNING: HIGH RISK PATTERN"),
                    react_1.default.createElement(ink_1.Text, null, "This pattern may cause temporary ego dissolution"),
                    react_1.default.createElement(ink_1.Text, null, "and significant alterations to perception of reality."),
                    !safetyProtocols.egoProtection && (react_1.default.createElement(ink_1.Text, { bold: true, color: "red" }, "SAFETY PROTOCOL DISABLED: Ego Protection")))) : null,
                react_1.default.createElement(ink_1.Box, { marginY: 2 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: pattern.riskLevel === 'EXTREME' ? "red" : "green", paddingX: 2, paddingY: 1, onPress: startNeuralSession },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Begin Neural Rip"))),
                react_1.default.createElement(ink_1.Box, { marginTop: 2 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                        react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
        }
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true, color: "magenta" }, "Neural Singularity Active")),
            react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", borderColor: "magenta", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Pattern: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, pattern.name)),
                react_1.default.createElement(ink_1.Text, null,
                    "Duration: ",
                    react_1.default.createElement(ink_1.Text, { bold: true },
                        Math.floor(sessionDuration / 60),
                        "m ",
                        sessionDuration % 60,
                        "s")),
                react_1.default.createElement(ink_1.Text, null,
                    "Intensity: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: sessionIntensity > 80 ? "red" : sessionIntensity > 50 ? "yellow" : "green" },
                        sessionIntensity,
                        "%")),
                react_1.default.createElement(ink_1.Text, null,
                    "Ego Integrity: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: egoLevel < 30 ? "red" : egoLevel < 60 ? "yellow" : "green" },
                        egoLevel,
                        "%"))),
            react_1.default.createElement(ink_1.Box, { marginY: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Thought Stream:"),
                thoughtStream.length === 0 ? (react_1.default.createElement(ink_1.Text, { italic: true }, "Awaiting consciousness expansion...")) : (thoughtStream.map((thought, idx) => (react_1.default.createElement(ink_1.Text, { key: idx, color: idx === thoughtStream.length - 1 ? "cyan" : "white" }, thought))))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    react_1.default.createElement(ink_1.Text, { color: "magenta" },
                        react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                    ' ',
                    "Neural rip in progress..."),
                neuralConnection.status === 'TRANSCENDING' && (react_1.default.createElement(ink_1.Text, { color: "magenta" }, "TRANSCENDENCE STATE ACHIEVED"))),
            react_1.default.createElement(ink_1.Box, { marginY: 2 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "red", paddingX: 2, paddingY: 1, onPress: endNeuralSession },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Terminate Neural Rip")))));
    };
    // Render the Settings screen
    const renderSettingsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Safety Protocols & Settings")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Configure neural interface safety parameters")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Safety Protocols"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: safetyProtocols.egoProtection ? "green" : "red", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => toggleSafetyProtocol('egoProtection') },
                    react_1.default.createElement(ink_1.Text, null,
                        "Ego Protection: ",
                        react_1.default.createElement(ink_1.Text, { bold: true, color: safetyProtocols.egoProtection ? "green" : "red" }, safetyProtocols.egoProtection ? "ENABLED" : "DISABLED")),
                    react_1.default.createElement(ink_1.Text, null, "Prevents complete ego dissolution during neural rip")),
                react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: safetyProtocols.realityAnchor ? "green" : "red", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => toggleSafetyProtocol('realityAnchor') },
                    react_1.default.createElement(ink_1.Text, null,
                        "Reality Anchor: ",
                        react_1.default.createElement(ink_1.Text, { bold: true, color: safetyProtocols.realityAnchor ? "green" : "red" }, safetyProtocols.realityAnchor ? "ENABLED" : "DISABLED")),
                    react_1.default.createElement(ink_1.Text, null, "Maintains connection to base reality during transcendence")),
                react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: safetyProtocols.autoTerminate ? "green" : "red", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => toggleSafetyProtocol('autoTerminate') },
                    react_1.default.createElement(ink_1.Text, null,
                        "Auto-Terminate: ",
                        react_1.default.createElement(ink_1.Text, { bold: true, color: safetyProtocols.autoTerminate ? "green" : "red" }, safetyProtocols.autoTerminate ? "ENABLED" : "DISABLED")),
                    react_1.default.createElement(ink_1.Text, null, "Automatically ends session if ego integrity falls below 20%")))),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Intensity Limiter"),
            react_1.default.createElement(ink_1.Text, null,
                "Maximum intensity allowed: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: safetyProtocols.intensityLimit > 80 ? "red" :
                        safetyProtocols.intensityLimit > 60 ? "yellow" : "green" },
                    safetyProtocols.intensityLimit,
                    "%")),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => adjustIntensityLimit(-10) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "- Decrease")),
                react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => adjustIntensityLimit(10) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "+ Increase"))),
            safetyProtocols.intensityLimit > 90 && (react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "red", paddingX: 2, paddingY: 1, marginTop: 1 },
                react_1.default.createElement(ink_1.Text, { color: "red", bold: true }, "WARNING: EXTREME INTENSITY"),
                react_1.default.createElement(ink_1.Text, null, "Settings above 90% may result in permanent"),
                react_1.default.createElement(ink_1.Text, null, "alterations to consciousness structure.")))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the appropriate screen based on activeScreen state
    if (activeScreen === 'CALIBRATE') {
        return renderCalibrateScreen();
    }
    if (activeScreen === 'PATTERNS') {
        return renderPatternsScreen();
    }
    if (activeScreen === 'ACTIVE_SESSION') {
        return renderActiveSessionScreen();
    }
    if (activeScreen === 'SETTINGS') {
        return renderSettingsScreen();
    }
    // Main menu
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "magenta" }, "Neural Singularity Ripping (NSR)")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "\"You don't hit the bong. The bong hits you.\""),
            react_1.default.createElement(ink_1.Text, null, "Direct brain-to-bong interface - no lungs required")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Neural Interface Status: ",
                react_1.default.createElement(ink_1.Text, { color: getStatusColor(neuralConnection.status) }, neuralConnection.status)),
            neuralConnection.status !== 'DISCONNECTED' && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Text, null,
                    "Signal Strength: ",
                    neuralConnection.signalStrength,
                    "%"),
                react_1.default.createElement(ink_1.Text, null,
                    "Neural Latency: ",
                    neuralConnection.latency,
                    "ms"),
                neuralConnection.activePattern && (react_1.default.createElement(ink_1.Text, null,
                    "Active Pattern: ",
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, brainwavePatterns.find(p => p.id === neuralConnection.activePattern)?.name || 'Unknown')))))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
};
exports.default = NeuralSingularityRipping;

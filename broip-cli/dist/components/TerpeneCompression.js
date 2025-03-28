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
const TerpeneCompression = ({ onReturn }) => {
    const { preferences } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [selectedStrain, setSelectedStrain] = (0, react_1.useState)(null);
    const [analyzing, setAnalyzing] = (0, react_1.useState)(false);
    const [optimizing, setOptimizing] = (0, react_1.useState)(false);
    const [upscaling, setUpscaling] = (0, react_1.useState)(false);
    const [encrypting, setEncrypting] = (0, react_1.useState)(false);
    const [optimizationProgress, setOptimizationProgress] = (0, react_1.useState)(0);
    const [compressionResults, setCompressionResults] = (0, react_1.useState)(null);
    const strainProfiles = [
        {
            id: 'strain1',
            name: 'OG Kush',
            type: 'HYBRID',
            terpenes: {
                'Myrcene': 0.5,
                'Limonene': 0.3,
                'Caryophyllene': 0.2,
                'Pinene': 0.1
            },
            thcContent: 22,
            cbdContent: 0.1,
            effects: ['Relaxed', 'Happy', 'Euphoric', 'Hungry'],
            compressionRatio: 1.8,
            quality: 'premium'
        },
        {
            id: 'strain2',
            name: 'Blue Dream',
            type: 'HYBRID',
            terpenes: {
                'Myrcene': 0.4,
                'Pinene': 0.3,
                'Caryophyllene': 0.1,
                'Terpinolene': 0.1
            },
            thcContent: 18,
            cbdContent: 0.2,
            effects: ['Creative', 'Uplifted', 'Relaxed', 'Gentle'],
            compressionRatio: 2.1,
            quality: 'premium'
        },
        {
            id: 'strain3',
            name: 'Granddaddy Purple',
            type: 'INDICA',
            terpenes: {
                'Myrcene': 0.8,
                'Pinene': 0.1,
                'Caryophyllene': 0.05
            },
            thcContent: 23,
            cbdContent: 0.1,
            effects: ['Sleepy', 'Relaxed', 'Hungry', 'Happy'],
            compressionRatio: 1.5,
            quality: 'exotic'
        },
        {
            id: 'strain4',
            name: 'Jack Herer',
            type: 'SATIVA',
            terpenes: {
                'Terpinolene': 0.4,
                'Pinene': 0.3,
                'Caryophyllene': 0.1
            },
            thcContent: 19,
            cbdContent: 0.1,
            effects: ['Energetic', 'Creative', 'Focused', 'Uplifted'],
            compressionRatio: 2.3,
            quality: 'premium'
        },
        {
            id: 'strain5',
            name: 'Reggie Special',
            type: 'HYBRID',
            terpenes: {
                'Myrcene': 0.2,
                'Pinene': 0.1,
                'Caryophyllene': 0.05
            },
            thcContent: 12,
            cbdContent: 0.3,
            effects: ['Mild', 'Subtle', 'Short-lasting'],
            compressionRatio: 3.0,
            quality: 'mids'
        },
        {
            id: 'strain6',
            name: 'Quantum Haze',
            type: 'SATIVA',
            terpenes: {
                'Terpinolene': 0.6,
                'Ocimene': 0.4,
                'Limonene': 0.3,
                'Nerolidol': 0.2
            },
            thcContent: 28,
            cbdContent: 0.05,
            effects: ['Euphoric', 'Energetic', 'Creative', 'Time-warping'],
            compressionRatio: 1.2,
            quality: 'exotic'
        }
    ];
    const menuItems = [
        {
            label: '🔍 Analyze Current Strain',
            value: 'analyze'
        },
        {
            label: '⚙️ Optimize Compression',
            value: 'optimize'
        },
        {
            label: '🚀 AI Strain Upscaling',
            value: 'upscale'
        },
        {
            label: '🔐 Entourage Effect Encryption',
            value: 'encrypt'
        },
        {
            label: '📊 View Compression Results',
            value: 'results'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    const strainItems = strainProfiles.map(strain => ({
        label: `${strain.name} (${strain.type}) - THC: ${strain.thcContent}% [${strain.quality}]`,
        value: strain.id
    }));
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else if (item.value === 'analyze') {
            setActiveScreen('ANALYZE');
        }
        else if (item.value === 'optimize') {
            setActiveScreen('OPTIMIZE');
        }
        else if (item.value === 'upscale') {
            setActiveScreen('AI_UPSCALE');
        }
        else if (item.value === 'encrypt') {
            setActiveScreen('ENTOURAGE_ENCRYPT');
        }
        else if (item.value === 'results') {
            setActiveScreen('RESULTS');
        }
    };
    const handleStrainSelect = (item) => {
        const strain = strainProfiles.find(s => s.id === item.value);
        if (strain) {
            setSelectedStrain(strain);
            setAnalyzing(true);
            // Simulate ML processing
            setTimeout(() => {
                setAnalyzing(false);
                // Generate compression results based on strain properties
                const originalSize = Math.floor(Math.random() * 500) + 500; // 500-1000 KB
                const compressionRatio = strain.compressionRatio;
                const compressedSize = Math.floor(originalSize / compressionRatio);
                const fidelity = Math.min(98, Math.floor(Math.random() * 20) + 70 + (strain.thcContent / 2));
                const psychoactivePreservation = Math.min(99, Math.floor(Math.random() * 10) + 85);
                const bandwidth = Math.floor(compressedSize * 8 / 10); // Kbps
                setCompressionResults({
                    originalSize,
                    compressedSize,
                    fidelity,
                    psychoactivePreservation,
                    bandwidth,
                    entourageEffectPreservation: Math.min(95, 70 + Math.random() * 25),
                    virtualQuality: strain.quality
                });
                setActiveScreen('RESULTS');
            }, 2000);
        }
    };
    const optimizeCompression = () => {
        if (!selectedStrain || !compressionResults)
            return;
        setOptimizing(true);
        setOptimizationProgress(0);
        // Simulate progressive optimization
        const interval = setInterval(() => {
            setOptimizationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishOptimization();
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };
    const finishOptimization = () => {
        if (!compressionResults)
            return;
        // Improve the compression results with TCA v3.0
        const optimizedResults = {
            originalSize: compressionResults.originalSize,
            compressedSize: Math.floor(compressionResults.compressedSize * 0.7),
            fidelity: Math.min(99.7, compressionResults.fidelity + 7),
            psychoactivePreservation: Math.min(99.9, compressionResults.psychoactivePreservation + 5),
            bandwidth: Math.floor(compressionResults.bandwidth * 0.7),
            entourageEffectPreservation: Math.min(99, (compressionResults.entourageEffectPreservation || 80) + 10),
            encryptionStrength: compressionResults.encryptionStrength,
            aiUpscalingFactor: compressionResults.aiUpscalingFactor,
            virtualQuality: compressionResults.virtualQuality
        };
        setCompressionResults(optimizedResults);
        setOptimizing(false);
        setActiveScreen('RESULTS');
    };
    const applyAIUpscaling = () => {
        if (!selectedStrain || !compressionResults)
            return;
        setUpscaling(true);
        // Simulate AI upscaling process
        setTimeout(() => {
            const qualityMap = {
                'mids': 'premium',
                'premium': 'exotic',
                'exotic': 'exotic+'
            };
            const upscaledResults = {
                ...compressionResults,
                fidelity: Math.min(99.9, compressionResults.fidelity + 10),
                psychoactivePreservation: Math.min(99.9, compressionResults.psychoactivePreservation + 8),
                aiUpscalingFactor: selectedStrain.quality === 'mids' ? 2.5 : 1.5,
                virtualQuality: qualityMap[selectedStrain.quality]
            };
            setCompressionResults(upscaledResults);
            setUpscaling(false);
            setActiveScreen('RESULTS');
        }, 3000);
    };
    const applyEntourageEncryption = () => {
        if (!selectedStrain || !compressionResults)
            return;
        setEncrypting(true);
        // Simulate encryption process
        setTimeout(() => {
            const encryptedResults = {
                ...compressionResults,
                compressedSize: Math.floor(compressionResults.compressedSize * 0.9),
                entourageEffectPreservation: 99.9,
                encryptionStrength: 256,
                bandwidth: Math.floor(compressionResults.bandwidth * 0.9) // 10% bandwidth reduction
            };
            setCompressionResults(encryptedResults);
            setEncrypting(false);
            setActiveScreen('RESULTS');
        }, 2500);
    };
    // Render the Analyze screen
    const renderAnalyzeScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Select Strain for TNN Analysis")),
        analyzing ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Analyzing terpene profiles for ",
                selectedStrain?.name),
            react_1.default.createElement(ink_1.Text, null, "Applying Terpene Neural Network algorithms..."),
            react_1.default.createElement(ink_1.Text, null, "Scanning blockchain for strain provenance..."))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Text, null, "The Terpene Neural Network will optimize compression based on strain profile"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_select_input_1.default, { items: strainItems, onSelect: handleStrainSelect })))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the Optimize screen
    const renderOptimizeScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "TCA v3.0 Optimization")),
        !selectedStrain ? (react_1.default.createElement(ink_1.Text, null, "Please analyze a strain first")) : optimizing ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Optimizing TCA v3.0 for ",
                selectedStrain.name),
            react_1.default.createElement(ink_1.Text, null,
                "Progress: ",
                optimizationProgress,
                "%"),
            react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < optimizationProgress / 2 ? '█' : '░').join(''))),
            react_1.default.createElement(ink_1.Text, null, "Applying \"Lossy but still lit\" compression algorithms..."),
            react_1.default.createElement(ink_1.Text, null, "Calibrating psychedelic fidelity parameters..."))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Strain: ",
                selectedStrain.name,
                " (",
                selectedStrain.type,
                ")"),
            react_1.default.createElement(ink_1.Text, null,
                "THC Content: ",
                selectedStrain.thcContent,
                "%"),
            react_1.default.createElement(ink_1.Text, null,
                "Quality Grade: ",
                react_1.default.createElement(ink_1.Text, { color: selectedStrain.quality === 'exotic' ? 'magenta' : selectedStrain.quality === 'premium' ? 'green' : 'yellow' }, selectedStrain.quality)),
            react_1.default.createElement(ink_1.Text, null, "Primary Terpenes:"),
            Object.entries(selectedStrain.terpenes).map(([name, percentage], index) => (react_1.default.createElement(ink_1.Text, { key: index },
                "- ",
                name,
                ": ",
                (percentage * 100).toFixed(1),
                "%"))),
            react_1.default.createElement(ink_1.Box, { marginY: 2 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, marginRight: 1, onPress: optimizeCompression },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Start Optimization"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the AI Upscale screen
    const renderAIUpscaleScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "magenta" }, "Strain-based AI Upscaling")),
        !selectedStrain ? (react_1.default.createElement(ink_1.Text, null, "Please analyze a strain first")) : upscaling ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "magenta" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Applying AI upscaling to ",
                selectedStrain.name),
            react_1.default.createElement(ink_1.Text, null,
                "Converting ",
                selectedStrain.quality,
                " to virtual exotic..."),
            react_1.default.createElement(ink_1.Text, null, "Enhancing terpene profiles with generative algorithms..."),
            react_1.default.createElement(ink_1.Text, null, "Boosting psychoactive signature..."))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Strain: ",
                selectedStrain.name,
                " (",
                selectedStrain.type,
                ")"),
            react_1.default.createElement(ink_1.Text, null,
                "Current Quality: ",
                react_1.default.createElement(ink_1.Text, { color: selectedStrain.quality === 'exotic' ? 'magenta' : selectedStrain.quality === 'premium' ? 'green' : 'yellow' }, selectedStrain.quality)),
            react_1.default.createElement(ink_1.Text, null,
                "THC Content: ",
                selectedStrain.thcContent,
                "%"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "AI Upscaling can transform your ",
                    selectedStrain.quality,
                    " strain into a virtual exotic experience."),
                react_1.default.createElement(ink_1.Text, null, "This process uses neural networks to enhance terpene profiles and boost psychoactive signatures.")),
            react_1.default.createElement(ink_1.Box, { marginY: 2 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "magenta", paddingX: 2, paddingY: 1, marginRight: 1, onPress: applyAIUpscaling },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Apply AI Upscaling"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the Entourage Encrypt screen
    const renderEntourageEncryptScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Entourage Effect Encryption (EEE)")),
        !selectedStrain ? (react_1.default.createElement(ink_1.Text, null, "Please analyze a strain first")) : encrypting ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "cyan" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Applying Entourage Effect Encryption to ",
                selectedStrain.name),
            react_1.default.createElement(ink_1.Text, null, "Generating 256-bit terpene keys..."),
            react_1.default.createElement(ink_1.Text, null, "Securing synergistic compound relationships..."),
            react_1.default.createElement(ink_1.Text, null, "Ensuring no terpene left behind..."))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Strain: ",
                selectedStrain.name,
                " (",
                selectedStrain.type,
                ")"),
            react_1.default.createElement(ink_1.Text, null,
                "Terpene Count: ",
                Object.keys(selectedStrain.terpenes).length),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, "Entourage Effect Encryption ensures that all terpenes and cannabinoids"),
                react_1.default.createElement(ink_1.Text, null, "maintain their synergistic relationships during transmission."),
                react_1.default.createElement(ink_1.Text, null, "This provides maximum therapeutic benefit and authentic experience.")),
            react_1.default.createElement(ink_1.Box, { marginY: 2 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "cyan", paddingX: 2, paddingY: 1, marginRight: 1, onPress: applyEntourageEncryption },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Apply EEE"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the Results screen
    const renderResultsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "TCA v3.0 Compression Results")),
        !compressionResults ? (react_1.default.createElement(ink_1.Text, null, "No compression results available yet. Analyze a strain first.")) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Strain: ",
                selectedStrain?.name),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Original Size: ",
                    react_1.default.createElement(ink_1.Text, { bold: true },
                        compressionResults.originalSize,
                        " KB")),
                react_1.default.createElement(ink_1.Text, null,
                    "Compressed Size: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "green" },
                        compressionResults.compressedSize,
                        " KB")),
                react_1.default.createElement(ink_1.Text, null,
                    "Compression Ratio: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" },
                        (compressionResults.originalSize / compressionResults.compressedSize).toFixed(2),
                        "x"))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Terpene Profile Fidelity: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" },
                        compressionResults.fidelity.toFixed(1),
                        "%")),
                react_1.default.createElement(ink_1.Text, null,
                    "Psychoactive Preservation: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "magenta" },
                        compressionResults.psychoactivePreservation.toFixed(1),
                        "%")),
                compressionResults.entourageEffectPreservation && (react_1.default.createElement(ink_1.Text, null,
                    "Entourage Effect Preservation: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "blue" },
                        compressionResults.entourageEffectPreservation.toFixed(1),
                        "%"))),
                react_1.default.createElement(ink_1.Text, null,
                    "Required Bandwidth: ",
                    react_1.default.createElement(ink_1.Text, { bold: true },
                        compressionResults.bandwidth,
                        " Kbps"))),
            compressionResults.aiUpscalingFactor && (react_1.default.createElement(ink_1.Box, { marginY: 1, borderStyle: "single", paddingX: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true, color: "magenta" }, "AI Upscaling Active"),
                react_1.default.createElement(ink_1.Text, null,
                    "Upscaling Factor: ",
                    react_1.default.createElement(ink_1.Text, { bold: true },
                        compressionResults.aiUpscalingFactor,
                        "x")),
                react_1.default.createElement(ink_1.Text, null,
                    "Virtual Quality: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "magenta" }, compressionResults.virtualQuality)),
                react_1.default.createElement(ink_1.Text, null,
                    "(Original: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" }, selectedStrain?.quality),
                    ")"))),
            compressionResults.encryptionStrength && (react_1.default.createElement(ink_1.Box, { marginY: 1, borderStyle: "single", paddingX: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Entourage Effect Encryption Active"),
                react_1.default.createElement(ink_1.Text, null,
                    "Encryption Strength: ",
                    react_1.default.createElement(ink_1.Text, { bold: true },
                        compressionResults.encryptionStrength,
                        "-bit")),
                react_1.default.createElement(ink_1.Text, null,
                    "Terpene Security: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Maximum")))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, getCompressionQualityMessage(compressionResults))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    const getCompressionQualityMessage = (results) => {
        if (results.aiUpscalingFactor && results.encryptionStrength) {
            return "🔮 ULTIMATE QUALITY: AI-enhanced, encrypted terpenes - beyond natural limits";
        }
        if (results.aiUpscalingFactor) {
            return "💎 ENHANCED QUALITY: AI has transformed this strain into virtual exotic";
        }
        if (results.encryptionStrength) {
            return "🔒 SECURED QUALITY: Entourage Effect Encryption ensures therapeutic integrity";
        }
        if (results.fidelity > 97)
            return "💯 Exceptional terpene preservation - indistinguishable from local experience";
        if (results.fidelity > 92)
            return "⭐ Excellent quality - minimal loss of subtle notes";
        if (results.fidelity > 85)
            return "👍 Good quality - primary effects preserved";
        return "✅ Acceptable quality - main effects present but some subtlety lost";
    };
    if (activeScreen === 'ANALYZE') {
        return renderAnalyzeScreen();
    }
    if (activeScreen === 'OPTIMIZE') {
        return renderOptimizeScreen();
    }
    if (activeScreen === 'AI_UPSCALE') {
        return renderAIUpscaleScreen();
    }
    if (activeScreen === 'ENTOURAGE_ENCRYPT') {
        return renderEntourageEncryptScreen();
    }
    if (activeScreen === 'RESULTS') {
        return renderResultsScreen();
    }
    // Main menu
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Enhanced Terpene Compression Algorithm v3.0")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "\"Lossy but still lit\" compression with strain-based AI upscaling"),
            react_1.default.createElement(ink_1.Text, null, "and Entourage Effect Encryption (EEE)")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, null, "Current Settings:"),
            react_1.default.createElement(ink_1.Text, null,
                "Optimization Level: ",
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, preferences.routeOptimizationLevel)),
            react_1.default.createElement(ink_1.Text, null,
                "Simulation Fidelity: ",
                react_1.default.createElement(ink_1.Text, { color: "cyan" }, preferences.simulationFidelity)),
            selectedStrain && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Text, null,
                    "Active Strain: ",
                    react_1.default.createElement(ink_1.Text, { color: "green" }, selectedStrain.name)),
                react_1.default.createElement(ink_1.Text, null,
                    "Quality: ",
                    react_1.default.createElement(ink_1.Text, { color: selectedStrain.quality === 'exotic' ? 'magenta' : selectedStrain.quality === 'premium' ? 'green' : 'yellow' }, selectedStrain.quality))))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
};
exports.default = TerpeneCompression;

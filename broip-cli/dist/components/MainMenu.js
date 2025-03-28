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
const RipInitiator_1 = __importDefault(require("./RipInitiator"));
const SystemMonitor_1 = __importDefault(require("./SystemMonitor"));
const CrystalAnalyzer_1 = __importDefault(require("./CrystalAnalyzer"));
const DiffusionConfig_1 = __importDefault(require("./DiffusionConfig"));
const BowlStatus_1 = __importDefault(require("./BowlStatus"));
const DabMarket_1 = __importDefault(require("./DabMarket"));
const FriendsList_1 = __importDefault(require("./FriendsList"));
const RoutePlanner_1 = __importDefault(require("./RoutePlanner"));
const Achievements_1 = __importDefault(require("./Achievements"));
const SensoryOutput_1 = __importDefault(require("./SensoryOutput"));
const RipAPI_1 = __importDefault(require("./RipAPI"));
const DecentralizedLedger_1 = __importDefault(require("./DecentralizedLedger"));
const LegalMode_1 = __importDefault(require("./LegalMode"));
const AutoCarb_1 = __importDefault(require("./AutoCarb"));
const NeuralSingularityRipping_1 = __importDefault(require("./NeuralSingularityRipping"));
const UserContext_1 = require("../utils/UserContext");
const MainMenu = () => {
    const [currentScreen, setCurrentScreen] = (0, react_1.useState)('menu');
    const { profile, updateProfile, recentAchievements, preferences, updatePreferences } = (0, UserContext_1.useUser)();
    const [showNotification, setShowNotification] = (0, react_1.useState)(false);
    const [notificationMessage, setNotificationMessage] = (0, react_1.useState)('');
    // Check for new achievements or notifications
    (0, react_1.useEffect)(() => {
        if (preferences.notifications && recentAchievements.length > 0) {
            const latestAchievement = recentAchievements[0];
            setNotificationMessage(`🏆 New Achievement: ${latestAchievement.title}`);
            setShowNotification(true);
            // Auto-hide notification after 5 seconds
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [recentAchievements, preferences.notifications]);
    const items = [
        {
            label: '💨 Chamber Control (Send Rip)',
            value: 'ri'
        },
        {
            label: '📊 Percolation Monitor',
            value: 'monitor'
        },
        {
            label: '💎 Crystal Analysis',
            value: 'crystal'
        },
        {
            label: '🔍 Diffusion Config',
            value: 'diffusion'
        },
        {
            label: '🍃 Bowl Status',
            value: 'bowl'
        },
        {
            label: '💰 Dab Market',
            value: 'market'
        },
        {
            label: '👥 Friends List',
            value: 'friends'
        },
        {
            label: '🗺️ Route Planner',
            value: 'routes'
        },
        {
            label: '🏆 Achievements',
            value: 'achievements'
        },
        {
            label: '✨ Sensory Experience',
            value: 'sensory'
        },
        {
            label: '🧠 Neural Singularity Ripping',
            value: 'neural'
        },
        {
            label: '💻 RIP-API',
            value: 'ripapi'
        },
        {
            label: '⛓️ Decentralized Ledger',
            value: 'ledger'
        },
        {
            label: '⚖️ Legal Mode',
            value: 'legal'
        },
        {
            label: '🤖 Auto-Carb',
            value: 'autocarb'
        },
        {
            label: '⚙️ Settings',
            value: 'settings'
        },
        {
            label: '❌ Exit',
            value: 'exit'
        }
    ];
    const settingsItems = [
        {
            label: `Theme: ${preferences.theme}`,
            value: 'theme'
        },
        {
            label: `Notifications: ${preferences.notifications ? 'ON' : 'OFF'}`,
            value: 'notifications'
        },
        {
            label: `Route Optimization: ${preferences.routeOptimizationLevel}`,
            value: 'optimization'
        },
        {
            label: `Simulation Fidelity: ${preferences.simulationFidelity}`,
            value: 'fidelity'
        },
        {
            label: `Show Metrics: ${preferences.showMetrics ? 'ON' : 'OFF'}`,
            value: 'metrics'
        },
        {
            label: '↩️ Back to Main Menu',
            value: 'back'
        }
    ];
    const handleSelect = (item) => {
        if (item.value === 'exit') {
            process.exit();
        }
        setCurrentScreen(item.value);
    };
    const handleSettingsSelect = (item) => {
        if (item.value === 'back') {
            setCurrentScreen('menu');
            return;
        }
        switch (item.value) {
            case 'theme':
                // Cycle through themes
                const themes = ['default', 'dark', 'psychedelic'];
                const currentIndex = themes.indexOf(preferences.theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                updatePreferences({ theme: nextTheme });
                break;
            case 'notifications':
                updatePreferences({ notifications: !preferences.notifications });
                break;
            case 'optimization':
                const levels = ['basic', 'advanced', 'quantum'];
                const currentLevel = levels.indexOf(preferences.routeOptimizationLevel);
                const nextLevel = levels[(currentLevel + 1) % levels.length];
                updatePreferences({ routeOptimizationLevel: nextLevel });
                break;
            case 'fidelity':
                const fidelities = ['low', 'medium', 'high'];
                const currentFidelity = fidelities.indexOf(preferences.simulationFidelity);
                const nextFidelity = fidelities[(currentFidelity + 1) % fidelities.length];
                updatePreferences({ simulationFidelity: nextFidelity });
                break;
            case 'metrics':
                updatePreferences({ showMetrics: !preferences.showMetrics });
                break;
        }
    };
    const handleReturn = () => {
        setCurrentScreen('menu');
    };
    if (currentScreen === 'ri') {
        return react_1.default.createElement(RipInitiator_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'monitor') {
        return react_1.default.createElement(SystemMonitor_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'crystal') {
        return react_1.default.createElement(CrystalAnalyzer_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'diffusion') {
        return react_1.default.createElement(DiffusionConfig_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'bowl') {
        return react_1.default.createElement(BowlStatus_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'market') {
        return react_1.default.createElement(DabMarket_1.default, { onReturn: handleReturn, userProfile: profile, onUpdateProfile: updateProfile });
    }
    if (currentScreen === 'friends') {
        return react_1.default.createElement(FriendsList_1.default, { onReturn: handleReturn, userProfile: profile, onUpdateProfile: updateProfile });
    }
    if (currentScreen === 'routes') {
        return react_1.default.createElement(RoutePlanner_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'achievements') {
        return react_1.default.createElement(Achievements_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'sensory') {
        return react_1.default.createElement(SensoryOutput_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'ripapi') {
        return react_1.default.createElement(RipAPI_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'ledger') {
        return react_1.default.createElement(DecentralizedLedger_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'legal') {
        return react_1.default.createElement(LegalMode_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'autocarb') {
        return react_1.default.createElement(AutoCarb_1.default, { onReturn: () => setCurrentScreen('menu') });
    }
    if (currentScreen === 'neural') {
        return react_1.default.createElement(NeuralSingularityRipping_1.default, { onReturn: handleReturn });
    }
    if (currentScreen === 'settings') {
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "BROIP SETTINGS")),
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Customize your BROIP terminal experience")),
            react_1.default.createElement(ink_select_input_1.default, { items: settingsItems, onSelect: handleSettingsSelect })));
    }
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP SIMULATION TERMINAL v4.20")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { color: "cyan" }, "Welcome to the Bong Rip Over IP Protocol Simulator")),
        showNotification && (react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "round", borderColor: "yellow", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, { color: "yellow" }, notificationMessage))),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { dimColor: true }, "\u2022 Configure your virtual glass"),
            react_1.default.createElement(ink_1.Text, { dimColor: true }, "\u2022 Monitor real-time percolation metrics"),
            react_1.default.createElement(ink_1.Text, { dimColor: true }, "\u2022 Analyze crystal formations"),
            react_1.default.createElement(ink_1.Text, { dimColor: true }, "\u2022 Track bowl status and performance"),
            react_1.default.createElement(ink_1.Text, { dimColor: true }, "\u2022 Plan optimal smoke delivery routes")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" },
                "User Profile: ",
                profile.username),
            react_1.default.createElement(ink_1.Text, null,
                "DabCoins: ",
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    profile.dabCoins.toFixed(2),
                    " DC")),
            react_1.default.createElement(ink_1.Text, null,
                "Inventory: ",
                react_1.default.createElement(ink_1.Text, { color: "cyan" },
                    profile.inventory.length,
                    " items")),
            react_1.default.createElement(ink_1.Text, null,
                "Friends: ",
                react_1.default.createElement(ink_1.Text, { color: "magenta" },
                    profile.friends.length,
                    " online")),
            preferences.showMetrics && (react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, { bold: true }, "BROIP Stats:"),
                react_1.default.createElement(ink_1.Text, null,
                    "Total Dabs: ",
                    profile.stats.totalDabs),
                react_1.default.createElement(ink_1.Text, null,
                    "Routes Created: ",
                    profile.stats.routesCreated),
                react_1.default.createElement(ink_1.Text, null,
                    "Highest Reliability: ",
                    profile.stats.highestReliabilityRoute.toFixed(1),
                    "%"))),
            recentAchievements.length > 0 && (react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null, "Recent Achievement: "),
                react_1.default.createElement(ink_1.Text, { color: "yellow" },
                    recentAchievements[0].icon,
                    " ",
                    recentAchievements[0].title)))),
        react_1.default.createElement(ink_select_input_1.default, { items: items, onSelect: handleSelect })));
};
exports.default = MainMenu;

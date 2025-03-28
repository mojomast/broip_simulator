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
const RipQualityService = ({ onReturn }) => {
    const { profile, updateProfile } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [selectedTier, setSelectedTier] = (0, react_1.useState)(serviceTiers[0]);
    const [activeSessions, setActiveSessions] = (0, react_1.useState)([]);
    const [selectedSession, setSelectedSession] = (0, react_1.useState)(null);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    // Generate a random session on first load
    (0, react_1.useEffect)(() => {
        if (activeSessions.length === 0) {
            createRandomSession();
        }
    }, [activeSessions]);
    const serviceTiers = [
        {
            id: 'casual',
            name: 'Casual Cloud',
            description: 'Balanced latency and fidelity for everyday rips',
            color: 'blue',
            latency: 45,
            fidelity: 85,
            reliability: 92,
            price: 0
        },
        {
            id: 'medical',
            name: 'Medical-Grade',
            description: 'Lossless terpene data transmission, prioritized routes',
            color: 'green',
            latency: 25,
            fidelity: 98,
            reliability: 99,
            price: 50
        },
        {
            id: 'dabstorm',
            name: 'Dab Storm',
            description: 'Maximum potency, enterprise-level throughput',
            color: 'magenta',
            latency: 10,
            fidelity: 99.9,
            reliability: 99.9,
            price: 200
        }
    ];
    const menuItems = [
        {
            label: '🔍 Manage Active Sessions',
            value: 'manage'
        },
        {
            label: '⬆️ Upgrade Service Tier',
            value: 'upgrade'
        },
        {
            label: '📊 View Performance Metrics',
            value: 'stats'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    const tierItems = serviceTiers.map(tier => ({
        label: `${tier.name} (${tier.price > 0 ? `${tier.price} DabCoins` : 'Free'})`,
        value: tier.id
    }));
    const createRandomSession = () => {
        const destinations = [
            "Friend's Apartment",
            "Headshop Lounge",
            "Virtual Sesh Room",
            "Medical Dispensary",
            "Cosmic Hub"
        ];
        const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
        const randomTier = serviceTiers[Math.floor(Math.random() * 2)]; // Only free or medical by default
        const newSession = {
            id: Math.random().toString(36).substr(2, 9),
            destination: randomDestination,
            tier: randomTier,
            startTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
            status: 'ACTIVE',
            metrics: {
                packetLoss: Math.random() * 5,
                jitter: Math.random() * 15,
                bandwidth: 100 + Math.floor(Math.random() * 900)
            }
        };
        setActiveSessions(prev => [...prev, newSession]);
        return newSession;
    };
    const upgradeTier = (tierId) => {
        const tier = serviceTiers.find(t => t.id === tierId);
        if (!tier)
            return;
        // Check if user has enough DabCoins
        if (profile.dabCoins < tier.price) {
            // Handle insufficient funds
            return;
        }
        setIsProcessing(true);
        // Simulate upgrade process
        setTimeout(() => {
            // Update selected tier
            setSelectedTier(tier);
            // Deduct coins if it's a paid tier
            if (tier.price > 0) {
                updateProfile({
                    ...profile,
                    dabCoins: profile.dabCoins - tier.price
                });
            }
            // Update existing sessions
            if (selectedSession) {
                setActiveSessions(prev => prev.map(session => session.id === selectedSession
                    ? {
                        ...session,
                        tier,
                        status: 'CONNECTING',
                        metrics: {
                            ...session.metrics,
                            packetLoss: Math.max(0, session.metrics.packetLoss - 2),
                            jitter: Math.max(0, session.metrics.jitter - 5)
                        }
                    }
                    : session));
                // Simulate connection stabilizing
                setTimeout(() => {
                    setActiveSessions(prev => prev.map(session => session.id === selectedSession
                        ? { ...session, status: 'ACTIVE' }
                        : session));
                }, 1500);
            }
            setIsProcessing(false);
            setActiveScreen('MANAGE');
        }, 2000);
    };
    const terminateSession = (sessionId) => {
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
        if (selectedSession === sessionId) {
            setSelectedSession(null);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'green';
            case 'CONNECTING': return 'yellow';
            case 'DEGRADED': return 'red';
            case 'CLOSED': return 'gray';
            default: return 'white';
        }
    };
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    const formatDuration = (startTime) => {
        const diffMs = new Date().getTime() - startTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const remainingMins = diffMins % 60;
        if (diffHours > 0) {
            return `${diffHours}h ${remainingMins}m`;
        }
        return `${diffMins}m`;
    };
    const handleSessionSelect = (sessionId) => {
        setSelectedSession(sessionId);
    };
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else {
            setActiveScreen(item.value);
        }
    };
    const ActiveSessionItem = ({ session }) => (react_1.default.createElement(ink_1.Box, { key: session.id, flexDirection: "column", borderStyle: selectedSession === session.id ? "double" : "single", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => handleSessionSelect(session.id) },
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Destination: ",
                session.destination),
            react_1.default.createElement(ink_1.Text, null, " - "),
            react_1.default.createElement(ink_1.Text, { color: getStatusColor(session.status) }, session.status)),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Tier: ",
                react_1.default.createElement(ink_1.Text, { color: session.tier.color }, session.tier.name)),
            react_1.default.createElement(ink_1.Text, null, " \u2022 "),
            react_1.default.createElement(ink_1.Text, null,
                "Started: ",
                formatTime(session.startTime),
                " (",
                formatDuration(session.startTime),
                ")")),
        selectedSession === session.id && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null,
                    "Packet Loss: ",
                    session.metrics.packetLoss.toFixed(1),
                    "%"),
                react_1.default.createElement(ink_1.Text, null,
                    "Jitter: ",
                    session.metrics.jitter.toFixed(1),
                    " ms"),
                react_1.default.createElement(ink_1.Text, null,
                    "Bandwidth: ",
                    session.metrics.bandwidth,
                    " Kbps")),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "yellow", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => setActiveScreen('UPGRADE') },
                    react_1.default.createElement(ink_1.Text, { color: "black" }, "Upgrade Tier")),
                react_1.default.createElement(ink_1.Box, { backgroundColor: "red", paddingX: 2, paddingY: 1, onPress: () => terminateSession(session.id) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "End Session")))))));
    const SessionStats = ({ session }) => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Text, null,
            "Packet Loss: ",
            session.metrics.packetLoss.toFixed(1),
            "%"),
        react_1.default.createElement(ink_1.Text, null,
            "Jitter: ",
            session.metrics.jitter.toFixed(1),
            " ms"),
        react_1.default.createElement(ink_1.Text, null,
            "Bandwidth: ",
            session.metrics.bandwidth,
            " Kbps")));
    const ManageSessions = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Manage RQoS Sessions")),
        activeSessions.length === 0 ? (react_1.default.createElement(ink_1.Box, { marginY: 2 },
            react_1.default.createElement(ink_1.Text, null, "No active sessions. Create a new one!"),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, onPress: () => {
                        const newSession = createRandomSession();
                        setSelectedSession(newSession.id);
                    } },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Create Session"))))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, activeSessions.map(session => (react_1.default.createElement(ActiveSessionItem, { key: session.id, session: session }))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    const UpgradeTier = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Upgrade RQoS Tier")),
        isProcessing ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Upgrading service tier..."),
            react_1.default.createElement(ink_1.Text, null, "Adjusting RQoS parameters..."),
            react_1.default.createElement(ink_1.Text, null, "Rebalancing terpene bandwidth allocation..."))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Available DabCoins: ",
                    react_1.default.createElement(ink_1.Text, { color: "yellow" }, profile.dabCoins.toFixed(2)))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, serviceTiers.map(tier => (react_1.default.createElement(ink_1.Box, { key: tier.id, flexDirection: "column", borderStyle: selectedTier.id === tier.id ? "double" : "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { color: tier.color, bold: true }, tier.name),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, null, tier.price > 0 ? `${tier.price} DabCoins` : 'Free')),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null, tier.description)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, null,
                        "Latency: ",
                        tier.latency,
                        "ms"),
                    react_1.default.createElement(ink_1.Text, null,
                        "Terpene Fidelity: ",
                        tier.fidelity.toFixed(1),
                        "%"),
                    react_1.default.createElement(ink_1.Text, null,
                        "Reliability: ",
                        tier.reliability.toFixed(1),
                        "%")),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 }, selectedTier.id !== tier.id ? (react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, onPress: () => upgradeTier(tier.id) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Select Tier"))) : (react_1.default.createElement(ink_1.Text, { color: "green" }, "\u2713 Current Tier"))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    const PerformanceStats = () => {
        // Calculate aggregate statistics
        const totalSessions = activeSessions.length;
        const averageLatency = selectedTier.latency;
        const uptimePercentage = 99.7;
        const packetLossAvg = activeSessions.reduce((sum, session) => sum + session.metrics.packetLoss, 0) / Math.max(1, totalSessions);
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "RQoS Performance Metrics")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Service Uptime"),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "Uptime: ",
                        react_1.default.createElement(ink_1.Text, { color: "green" },
                            uptimePercentage.toFixed(1),
                            "%")),
                    react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                    react_1.default.createElement(ink_1.Text, null,
                        "Active Sessions: ",
                        totalSessions)),
                react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < (uptimePercentage / 2) ? '█' : '░').join('')))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Quality Metrics"),
                react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, null,
                        "Avg. Latency: ",
                        react_1.default.createElement(ink_1.Text, { color: averageLatency < 30 ? "green" : "yellow" },
                            averageLatency,
                            "ms")),
                    react_1.default.createElement(ink_1.Text, null,
                        "Avg. Packet Loss: ",
                        react_1.default.createElement(ink_1.Text, { color: packetLossAvg < 2 ? "green" : "yellow" },
                            packetLossAvg.toFixed(1),
                            "%")),
                    react_1.default.createElement(ink_1.Text, null,
                        "Terpene Fidelity: ",
                        react_1.default.createElement(ink_1.Text, { color: "green" },
                            selectedTier.fidelity.toFixed(1),
                            "%")))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Recommendation"),
                react_1.default.createElement(ink_1.Box, { marginY: 1 }, selectedTier.id === 'dabstorm' ? (react_1.default.createElement(ink_1.Text, { color: "green" }, "You're already on our top tier service! Enjoy maximum rip quality.")) : (react_1.default.createElement(ink_1.Text, null,
                    "Upgrade to ",
                    serviceTiers.find(t => t.id !== selectedTier.id)?.name,
                    " for ",
                    selectedTier.id === 'casual' ? '13ms lower latency' : '15ms lower latency and 99.9% reliability')))),
            react_1.default.createElement(ink_1.Box, { marginTop: 2 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                    react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    };
    const MainMenu = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Dynamic RQoS Service Manager")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Prioritize your rips with tiered service levels")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, null, "Active Tier: "),
                react_1.default.createElement(ink_1.Text, { color: selectedTier.color, bold: true }, selectedTier.name)),
            react_1.default.createElement(ink_1.Text, null,
                "Active Sessions: ",
                activeSessions.length),
            react_1.default.createElement(ink_1.Text, null,
                "DabCoins Available: ",
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, profile.dabCoins.toFixed(2)))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        activeScreen === 'MENU' && react_1.default.createElement(MainMenu, null),
        activeScreen === 'MANAGE' && react_1.default.createElement(ManageSessions, null),
        activeScreen === 'UPGRADE' && react_1.default.createElement(UpgradeTier, null),
        activeScreen === 'STATS' && react_1.default.createElement(PerformanceStats, null)));
};
exports.default = RipQualityService;

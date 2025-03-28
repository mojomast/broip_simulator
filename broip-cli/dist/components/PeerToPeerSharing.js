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
const PeerToPeerSharing = ({ onReturn }) => {
    const { profile } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [activeSessions, setActiveSessions] = (0, react_1.useState)([]);
    const [availablePeers, setAvailablePeers] = (0, react_1.useState)([]);
    const [selectedPeer, setSelectedPeer] = (0, react_1.useState)(null);
    const [selectedSession, setSelectedSession] = (0, react_1.useState)(null);
    const [encryptionLevel, setEncryptionLevel] = (0, react_1.useState)('STANDARD');
    const [sessionCreationStep, setSessionCreationStep] = (0, react_1.useState)(1);
    const [sessionName, setSessionName] = (0, react_1.useState)('Private Session');
    // Initialize with some peers on first load
    (0, react_1.useEffect)(() => {
        const initialPeers = [
            {
                id: 'p1',
                username: 'CloudChaser420',
                status: 'ONLINE',
                latency: 35,
                trust: 95,
                lastActive: '1m ago',
                encryption: 'END_TO_END'
            },
            {
                id: 'p2',
                username: 'DabQueen',
                status: 'DABBING',
                latency: 42,
                trust: 87,
                lastActive: 'Just now',
                encryption: 'STANDARD'
            },
            {
                id: 'p3',
                username: 'TerpLord',
                status: 'ONLINE',
                latency: 28,
                trust: 91,
                lastActive: '5m ago',
                encryption: 'END_TO_END'
            },
            {
                id: 'p4',
                username: 'GlassArtist',
                status: 'OFFLINE',
                latency: 105,
                trust: 70,
                lastActive: '3h ago',
                encryption: 'STANDARD'
            },
            {
                id: 'p5',
                username: 'QuantumRipper',
                status: 'BUSY',
                latency: 15,
                trust: 99,
                lastActive: '2m ago',
                encryption: 'QUANTUM'
            }
        ];
        setAvailablePeers(initialPeers);
    }, []);
    const menuItems = [
        {
            label: '➕ Create Direct Session',
            value: 'create'
        },
        {
            label: '🔗 Join Session Room',
            value: 'join'
        },
        {
            label: '👁️ Manage Active Sessions',
            value: 'manage'
        },
        {
            label: '🔒 Privacy Settings',
            value: 'privacy'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    const encryptionItems = [
        {
            label: 'Standard Encryption (Lower Latency)',
            value: 'STANDARD'
        },
        {
            label: 'End-to-End Encryption (Higher Privacy)',
            value: 'END_TO_END'
        },
        {
            label: 'Quantum Encryption (Experimental)',
            value: 'QUANTUM'
        }
    ];
    const createSession = (peerId) => {
        const peer = availablePeers.find(p => p.id === peerId);
        if (!peer)
            return;
        setIsProcessing(true);
        // Simulate session setup
        setTimeout(() => {
            const newSession = {
                id: Math.random().toString(36).substr(2, 9),
                name: sessionName || `Direct Session with ${peer.username}`,
                peerId: peer.id,
                peerName: peer.username,
                startTime: new Date(),
                status: 'CONNECTING',
                directConnection: true,
                metrics: {
                    latency: encryptionLevel === 'QUANTUM' ? peer.latency + 20 :
                        encryptionLevel === 'END_TO_END' ? peer.latency + 10 : peer.latency,
                    bandwidth: encryptionLevel === 'QUANTUM' ? 100 :
                        encryptionLevel === 'END_TO_END' ? 250 : 500,
                    privacy: encryptionLevel === 'QUANTUM' ? 99 :
                        encryptionLevel === 'END_TO_END' ? 90 : 70
                }
            };
            setActiveSessions(prev => [...prev, newSession]);
            setSelectedSession(newSession.id);
            // Simulate connection established
            setTimeout(() => {
                setActiveSessions(prev => prev.map(session => session.id === newSession.id
                    ? { ...session, status: 'ACTIVE' }
                    : session));
                setIsProcessing(false);
                setActiveScreen('MANAGE');
            }, 1500);
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
            case 'ONLINE': return 'green';
            case 'BUSY': return 'yellow';
            case 'OFFLINE': return 'gray';
            case 'DABBING': return 'cyan';
            case 'CONNECTING': return 'yellow';
            case 'ACTIVE': return 'green';
            case 'DEGRADED': return 'red';
            case 'CLOSED': return 'gray';
            default: return 'white';
        }
    };
    const formatDuration = (startTime) => {
        const diffMs = new Date().getTime() - startTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        if (diffMins > 0) {
            return `${diffMins}m ${diffSecs}s`;
        }
        return `${diffSecs}s`;
    };
    const getPrivacyRating = (privacy) => {
        if (privacy >= 95)
            return "Maximum Privacy";
        if (privacy >= 85)
            return "Very High Privacy";
        if (privacy >= 70)
            return "Good Privacy";
        return "Basic Privacy";
    };
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else {
            setActiveScreen(item.value);
        }
    };
    const handlePeerSelect = (peerId) => {
        setSelectedPeer(peerId);
        setSessionCreationStep(2);
    };
    const handleEncryptionSelect = (encryption) => {
        setEncryptionLevel(encryption);
        setSessionCreationStep(3);
    };
    // Main menu screen
    const renderMenuScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Peer-to-Peer Rip Sharing")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Direct RI-to-RR connections for private sessions")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Active P2P Sessions: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, activeSessions.length)),
            react_1.default.createElement(ink_1.Text, null,
                "Online Peers: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, availablePeers.filter(p => p.status !== 'OFFLINE').length)),
            react_1.default.createElement(ink_1.Text, null,
                "Encryption: ",
                react_1.default.createElement(ink_1.Text, { bold: true }, encryptionLevel)),
            react_1.default.createElement(ink_1.Text, null,
                "Avg Latency: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" },
                    activeSessions.length > 0
                        ? Math.floor(activeSessions.reduce((sum, session) => sum + session.metrics.latency, 0) / activeSessions.length)
                        : '--',
                    " ms"))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: (item) => handleMenuSelect(item) })));
    // Create session screen
    const renderCreateScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Create P2P Session"),
            react_1.default.createElement(ink_1.Text, null,
                " - Step ",
                sessionCreationStep,
                "/3")),
        isProcessing ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Establishing direct connection..."),
            react_1.default.createElement(ink_1.Text, null,
                "Setting up ",
                encryptionLevel,
                " encryption..."),
            react_1.default.createElement(ink_1.Text, null, "Negotiating connection parameters..."))) : sessionCreationStep === 1 ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Select a peer to connect with:")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, availablePeers
                .filter(peer => peer.status !== 'OFFLINE')
                .map(peer => (react_1.default.createElement(ink_1.Box, { key: peer.id, flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, peer.username),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: getStatusColor(peer.status) }, peer.status)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "Latency: ",
                        react_1.default.createElement(ink_1.Text, { color: peer.latency < 50 ? "green" : "yellow" },
                            peer.latency,
                            " ms")),
                    react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                    react_1.default.createElement(ink_1.Text, null,
                        "Trust: ",
                        react_1.default.createElement(ink_1.Text, { color: peer.trust > 90 ? "green" : "yellow" },
                            peer.trust,
                            "%")),
                    react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                    react_1.default.createElement(ink_1.Text, null,
                        "Last Active: ",
                        peer.lastActive)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => handlePeerSelect(peer.id) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Select"))))))))) : sessionCreationStep === 2 ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Select encryption level:")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, encryptionItems.map(item => (react_1.default.createElement(ink_1.Box, { key: item.value, flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, item.label),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    item.value === 'STANDARD' && (react_1.default.createElement(ink_1.Text, null, "Basic encryption with optimal performance.")),
                    item.value === 'END_TO_END' && (react_1.default.createElement(ink_1.Text, null, "No middleman access, better privacy but slight latency impact.")),
                    item.value === 'QUANTUM' && (react_1.default.createElement(ink_1.Text, null, "Experimental ultra-secure encryption. Higher latency."))),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => handleEncryptionSelect(item.value) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Select"))))))))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Confirm session details:")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Peer: ",
                    react_1.default.createElement(ink_1.Text, { bold: true }, availablePeers.find(p => p.id === selectedPeer)?.username)),
                react_1.default.createElement(ink_1.Text, null,
                    "Encryption: ",
                    react_1.default.createElement(ink_1.Text, { bold: true }, encryptionLevel)),
                react_1.default.createElement(ink_1.Text, null,
                    "Session Name: ",
                    react_1.default.createElement(ink_1.Text, { bold: true }, sessionName)),
                react_1.default.createElement(ink_1.Text, null,
                    "Estimated Latency: ",
                    react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" },
                        (availablePeers.find(p => p.id === selectedPeer)?.latency || 0) +
                            (encryptionLevel === 'STANDARD' ? 0 : encryptionLevel === 'END_TO_END' ? 10 : 20),
                        " ms"))),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => selectedPeer && createSession(selectedPeer) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Create Session")),
                react_1.default.createElement(ink_1.Box, { backgroundColor: "red", paddingX: 2, paddingY: 1, onPress: () => {
                        setSessionCreationStep(1);
                        setSelectedPeer(null);
                    } },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Cancel"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Join session screen
    const renderJoinScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Join Session Room")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Available session rooms:")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { color: "yellow" }, "Community Session Rooms Coming Soon!"),
            react_1.default.createElement(ink_1.Text, null, "This feature will be available in the next update."),
            react_1.default.createElement(ink_1.Text, null, "For now, use 'Create Direct Session' to establish P2P connections.")),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Manage sessions screen
    const renderManageScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Manage P2P Sessions")),
        activeSessions.length === 0 ? (react_1.default.createElement(ink_1.Box, { marginY: 2 },
            react_1.default.createElement(ink_1.Text, null, "No active P2P sessions. Create a new one!"),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, onPress: () => setActiveScreen('CREATE') },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Create Session"))))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, activeSessions.map(session => (react_1.default.createElement(ink_1.Box, { key: session.id, flexDirection: "column", borderStyle: selectedSession === session.id ? "double" : "single", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedSession(session.id) },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, session.name),
                react_1.default.createElement(ink_1.Text, null, " - "),
                react_1.default.createElement(ink_1.Text, { color: getStatusColor(session.status) }, session.status)),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Connected to: ",
                    react_1.default.createElement(ink_1.Text, { bold: true }, session.peerName)),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, null,
                    "Duration: ",
                    formatDuration(session.startTime))),
            selectedSession === session.id && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, null,
                        "Connection Type: ",
                        session.directConnection ? "Direct P2P" : "HARN-Routed"),
                    react_1.default.createElement(ink_1.Text, null,
                        "Latency: ",
                        react_1.default.createElement(ink_1.Text, { color: session.metrics.latency < 50 ? "green" : "yellow" },
                            session.metrics.latency,
                            " ms")),
                    react_1.default.createElement(ink_1.Text, null,
                        "Bandwidth: ",
                        session.metrics.bandwidth,
                        " Kbps"),
                    react_1.default.createElement(ink_1.Text, null,
                        "Privacy Rating: ",
                        react_1.default.createElement(ink_1.Text, { color: session.metrics.privacy > 80 ? "green" : "yellow" },
                            getPrivacyRating(session.metrics.privacy),
                            " (",
                            session.metrics.privacy,
                            "/100)"))),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "red", paddingX: 2, paddingY: 1, onPress: () => terminateSession(session.id) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "End Session")))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Privacy settings screen
    const renderPrivacyScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "P2P Privacy Settings")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Current Encryption: ",
                react_1.default.createElement(ink_1.Text, { color: encryptionLevel === 'QUANTUM' ? 'magenta' :
                        encryptionLevel === 'END_TO_END' ? 'green' : 'yellow' }, encryptionLevel)),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, "Default encryption level for new P2P sessions")),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 }, encryptionItems.map(item => (react_1.default.createElement(ink_1.Box, { key: item.value, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: encryptionLevel === item.value ? "green" : "blue", paddingX: 2, paddingY: 1, onPress: () => setEncryptionLevel(item.value) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, item.label))))))),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Additional Settings"),
            react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Auto-Accept Friend Requests: ON"))),
                react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Show Online Status: ON"))),
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Anonymous Usage Stats: OFF"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    if (activeScreen === 'CREATE') {
        return renderCreateScreen();
    }
    if (activeScreen === 'JOIN') {
        return renderJoinScreen();
    }
    if (activeScreen === 'MANAGE') {
        return renderManageScreen();
    }
    if (activeScreen === 'PRIVACY') {
        return renderPrivacyScreen();
    }
    return renderMenuScreen();
};
exports.default = PeerToPeerSharing;

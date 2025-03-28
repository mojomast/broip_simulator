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
const HARNManager = ({ onReturn }) => {
    const { preferences } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [nodes, setNodes] = (0, react_1.useState)([]);
    const [nodeGroups, setNodeGroups] = (0, react_1.useState)([]);
    const [selectedNode, setSelectedNode] = (0, react_1.useState)(null);
    const [selectedGroup, setSelectedGroup] = (0, react_1.useState)(null);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [alertMode, setAlertMode] = (0, react_1.useState)(false);
    const [alertMessage, setAlertMessage] = (0, react_1.useState)('');
    const [simulationMode, setSimulationMode] = (0, react_1.useState)('NONE');
    const [simulationProgress, setSimulationProgress] = (0, react_1.useState)(0);
    // Initialize nodes and groups
    (0, react_1.useEffect)(() => {
        const initialNodes = [
            {
                id: 'geo1',
                name: 'Alpha Geostationary',
                type: 'GEOSTATIONARY',
                status: 'ONLINE',
                location: 'Pacific Quadrant',
                altitude: 35786000,
                loadPercentage: 63,
                reliability: 98.5
            },
            {
                id: 'geo2',
                name: 'Beta Geostationary',
                type: 'GEOSTATIONARY',
                status: 'ONLINE',
                location: 'Atlantic Quadrant',
                altitude: 35786000,
                loadPercentage: 72,
                reliability: 97.8
            },
            {
                id: 'drone1',
                name: 'StratoVape Drone',
                type: 'DRONE',
                status: 'ONLINE',
                location: 'North America',
                altitude: 18000,
                loadPercentage: 41,
                reliability: 94.2
            },
            {
                id: 'drone2',
                name: 'CloudHover Drone',
                type: 'DRONE',
                status: 'MAINTENANCE',
                location: 'Europe',
                altitude: 17500,
                loadPercentage: 0,
                reliability: 93.7
            },
            {
                id: 'backup1',
                name: 'Bunker Rip Alpha',
                type: 'GROUND_BACKUP',
                status: 'ONLINE',
                location: 'Denver',
                altitude: 0,
                loadPercentage: 12,
                reliability: 99.2,
                backupOf: 'geo1'
            },
            {
                id: 'backup2',
                name: 'Bunker Rip Beta',
                type: 'GROUND_BACKUP',
                status: 'ONLINE',
                location: 'Frankfurt',
                altitude: 0,
                loadPercentage: 8,
                reliability: 99.5,
                backupOf: 'geo2'
            },
            {
                id: 'backup3',
                name: 'Bunker Rip Gamma',
                type: 'GROUND_BACKUP',
                status: 'ONLINE',
                location: 'Tokyo',
                altitude: 0,
                loadPercentage: 5,
                reliability: 99.3,
                backupOf: 'drone1'
            }
        ];
        const initialGroups = [
            {
                id: 'group1',
                name: 'Pacific Relay Group',
                primaryNodeId: 'geo1',
                backupNodeIds: ['backup1'],
                status: 'OPTIMAL',
                activeBackup: false,
                coverage: ['Western North America', 'East Asia', 'Oceania']
            },
            {
                id: 'group2',
                name: 'Atlantic Relay Group',
                primaryNodeId: 'geo2',
                backupNodeIds: ['backup2'],
                status: 'OPTIMAL',
                activeBackup: false,
                coverage: ['Eastern North America', 'Europe', 'Africa']
            },
            {
                id: 'group3',
                name: 'North America Drone Group',
                primaryNodeId: 'drone1',
                backupNodeIds: ['backup3'],
                status: 'OPTIMAL',
                activeBackup: false,
                coverage: ['North America Continental']
            },
            {
                id: 'group4',
                name: 'Europe Drone Group',
                primaryNodeId: 'drone2',
                backupNodeIds: [],
                status: 'DEGRADED',
                activeBackup: false,
                coverage: ['European Continental']
            }
        ];
        setNodes(initialNodes);
        setNodeGroups(initialGroups);
    }, []);
    const menuItems = [
        {
            label: '📡 View Relay Nodes',
            value: 'nodes'
        },
        {
            label: '🔄 Manage Node Groups',
            value: 'groups'
        },
        {
            label: '⚠️ Simulate Outage Events',
            value: 'simulate'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    const simulationItems = [
        {
            label: '☀️ Solar Flare Event',
            value: 'SOLAR_FLARE'
        },
        {
            label: '🔌 Node Outage',
            value: 'OUTAGE'
        },
        {
            label: '🔍 Government Inspection',
            value: 'INSPECTION'
        }
    ];
    const getNodeStatusColor = (status) => {
        switch (status) {
            case 'ONLINE': return 'green';
            case 'DEGRADED': return 'yellow';
            case 'OFFLINE': return 'red';
            case 'MAINTENANCE': return 'blue';
            default: return 'white';
        }
    };
    const getGroupStatusColor = (status) => {
        switch (status) {
            case 'OPTIMAL': return 'green';
            case 'DEGRADED': return 'yellow';
            case 'CRITICAL': return 'red';
            default: return 'white';
        }
    };
    const formatAltitude = (meters) => {
        if (meters === 0)
            return 'Ground';
        if (meters >= 1000000)
            return `${(meters / 1000000).toFixed(1)}M km`;
        if (meters >= 1000)
            return `${(meters / 1000).toFixed(1)} km`;
        return `${meters} m`;
    };
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else {
            setActiveScreen(item.value);
        }
    };
    const toggleNodeBackup = (nodeId) => {
        // Find which group this node belongs to
        const group = nodeGroups.find(g => g.primaryNodeId === nodeId || g.backupNodeIds.includes(nodeId));
        if (!group)
            return;
        // Toggle backup state
        const updatedGroups = nodeGroups.map(g => {
            if (g.id === group.id) {
                return {
                    ...g,
                    activeBackup: !g.activeBackup,
                    status: !g.activeBackup ? 'OPTIMAL' : 'DEGRADED'
                };
            }
            return g;
        });
        setNodeGroups(updatedGroups);
        // Show alert about the change
        const newStatus = !group.activeBackup;
        setAlertMessage(`${newStatus ? 'Activated' : 'Deactivated'} backup nodes for ${group.name}`);
        setAlertMode(true);
        setActiveScreen('ALERT');
        // Auto-dismiss alert after 3 seconds
        setTimeout(() => {
            if (activeScreen === 'ALERT') {
                setActiveScreen('GROUPS');
                setAlertMode(false);
            }
        }, 3000);
    };
    const runSimulation = (type) => {
        setSimulationMode(type);
        setSimulationProgress(0);
        setIsProcessing(true);
        // Simulation increments
        const timer = setInterval(() => {
            setSimulationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    finishSimulation(type);
                    return 100;
                }
                return prev + 5;
            });
        }, 200);
    };
    const finishSimulation = (type) => {
        // Different outcomes based on simulation type
        let updatedNodes = [...nodes];
        let updatedGroups = [...nodeGroups];
        let alertMsg = '';
        switch (type) {
            case 'SOLAR_FLARE':
                // Solar flare affects all geostationary satellites
                updatedNodes = nodes.map(node => {
                    if (node.type === 'GEOSTATIONARY') {
                        return {
                            ...node,
                            status: 'DEGRADED',
                            loadPercentage: Math.max(0, node.loadPercentage - 50),
                            reliability: Math.max(0, node.reliability - 20)
                        };
                    }
                    return node;
                });
                // Update affected groups
                updatedGroups = nodeGroups.map(group => {
                    const primaryNode = updatedNodes.find(n => n.id === group.primaryNodeId);
                    if (primaryNode && primaryNode.type === 'GEOSTATIONARY') {
                        return {
                            ...group,
                            status: 'DEGRADED',
                            activeBackup: true
                        };
                    }
                    return group;
                });
                alertMsg = 'SOLAR FLARE ALERT: Geostationary nodes degraded. Bunker Rips activated.';
                break;
            case 'OUTAGE':
                // Random node outage
                const randomNodeIndex = Math.floor(Math.random() * nodes.length);
                const affectedNodeId = nodes[randomNodeIndex].id;
                updatedNodes = nodes.map(node => {
                    if (node.id === affectedNodeId) {
                        return {
                            ...node,
                            status: 'OFFLINE',
                            loadPercentage: 0
                        };
                    }
                    return node;
                });
                // Update affected group
                updatedGroups = nodeGroups.map(group => {
                    if (group.primaryNodeId === affectedNodeId) {
                        return {
                            ...group,
                            status: 'DEGRADED',
                            activeBackup: true
                        };
                    }
                    return group;
                });
                const affectedNode = nodes.find(n => n.id === affectedNodeId);
                alertMsg = `NODE OUTAGE: ${affectedNode?.name} is offline. Backup systems engaged.`;
                break;
            case 'INSPECTION':
                // Government inspection - all nodes go into stealth mode
                updatedNodes = nodes.map(node => {
                    return {
                        ...node,
                        loadPercentage: Math.max(0, node.loadPercentage - 30),
                        status: node.status === 'ONLINE' ? 'MAINTENANCE' : node.status
                    };
                });
                // Ground backup nodes take over
                updatedGroups = nodeGroups.map(group => {
                    return {
                        ...group,
                        status: 'DEGRADED',
                        activeBackup: true
                    };
                });
                alertMsg = 'GOVERNMENT INSPECTION: All nodes in stealth mode. Bunker Rips handling traffic.';
                break;
        }
        setNodes(updatedNodes);
        setNodeGroups(updatedGroups);
        setAlertMessage(alertMsg);
        setAlertMode(true);
        setIsProcessing(false);
        setActiveScreen('ALERT');
        // Auto-restore after 10 seconds (in a real app, this would be much longer)
        setTimeout(restoreFromSimulation, 10000);
    };
    const restoreFromSimulation = () => {
        // Reset nodes and groups to normal operation
        setNodes(nodes.map(node => ({
            ...node,
            status: node.type === 'DRONE' && node.name === 'CloudHover Drone' ? 'MAINTENANCE' : 'ONLINE',
            loadPercentage: node.type === 'DRONE' && node.name === 'CloudHover Drone' ? 0 :
                node.type === 'GROUND_BACKUP' ? Math.floor(Math.random() * 15) :
                    40 + Math.floor(Math.random() * 40),
            reliability: node.reliability
        })));
        setNodeGroups(nodeGroups.map(group => ({
            ...group,
            status: group.name === 'Europe Drone Group' ? 'DEGRADED' : 'OPTIMAL',
            activeBackup: false
        })));
        setSimulationMode('NONE');
        // Show recovery message
        setAlertMessage('System recovered. All nodes restored to normal operation.');
        setAlertMode(true);
        setActiveScreen('ALERT');
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            if (activeScreen === 'ALERT') {
                setActiveScreen('NODES');
                setAlertMode(false);
            }
        }, 3000);
    };
    // Render the main menu
    const renderMenuScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "HARN Manager & Redundancy System")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Manage High-Altitude Relay Nodes with failover capabilities")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Active Nodes: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "green" },
                    nodes.filter(n => n.status === 'ONLINE').length,
                    "/",
                    nodes.length)),
            react_1.default.createElement(ink_1.Text, null,
                "Node Groups: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, nodeGroups.length)),
            react_1.default.createElement(ink_1.Text, null,
                "Network Status: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: nodeGroups.some(g => g.status === 'CRITICAL') ? 'red' :
                        nodeGroups.some(g => g.status === 'DEGRADED') ? 'yellow' : 'green' }, nodeGroups.some(g => g.status === 'CRITICAL') ? 'CRITICAL' :
                    nodeGroups.some(g => g.status === 'DEGRADED') ? 'DEGRADED' : 'OPTIMAL')),
            react_1.default.createElement(ink_1.Text, null,
                "Backup Systems: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" }, nodeGroups.filter(g => g.activeBackup).length > 0 ? 'ENGAGED' : 'STANDBY'))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
    // Render the nodes view
    const renderNodesScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "HARN Network Nodes")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, nodes.map(node => (react_1.default.createElement(ink_1.Box, { key: node.id, flexDirection: "column", borderStyle: selectedNode === node.id ? "double" : "single", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedNode(node.id) },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, node.name),
                react_1.default.createElement(ink_1.Text, null, " - "),
                react_1.default.createElement(ink_1.Text, { color: getNodeStatusColor(node.status) }, node.status)),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Type: ",
                    node.type),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, null,
                    "Location: ",
                    node.location)),
            selectedNode === node.id && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, null,
                        "Altitude: ",
                        formatAltitude(node.altitude)),
                    react_1.default.createElement(ink_1.Text, null,
                        "Load: ",
                        react_1.default.createElement(ink_1.Text, { color: node.loadPercentage > 80 ? 'red' :
                                node.loadPercentage > 60 ? 'yellow' : 'green' },
                            node.loadPercentage,
                            "%")),
                    react_1.default.createElement(ink_1.Text, null,
                        "Reliability: ",
                        react_1.default.createElement(ink_1.Text, { color: node.reliability > 98 ? 'green' :
                                node.reliability > 90 ? 'yellow' : 'red' },
                            node.reliability.toFixed(1),
                            "%")),
                    node.backupOf && (react_1.default.createElement(ink_1.Text, null,
                        "Backup for: ",
                        nodes.find(n => n.id === node.backupOf)?.name))),
                node.type === 'GROUND_BACKUP' && (react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => toggleNodeBackup(node.id) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Toggle Backup Status")))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the groups view
    const renderGroupsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "HARN Node Groups")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, nodeGroups.map(group => {
            const primaryNode = nodes.find(n => n.id === group.primaryNodeId);
            const backupNodes = nodes.filter(n => group.backupNodeIds.includes(n.id));
            return (react_1.default.createElement(ink_1.Box, { key: group.id, flexDirection: "column", borderStyle: selectedGroup === group.id ? "double" : "single", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedGroup(group.id) },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, group.name),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: getGroupStatusColor(group.status) }, group.status)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "Primary: ",
                        react_1.default.createElement(ink_1.Text, { bold: true }, primaryNode?.name)),
                    react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                    react_1.default.createElement(ink_1.Text, null,
                        "Backup: ",
                        group.activeBackup ?
                            react_1.default.createElement(ink_1.Text, { color: "green" }, "ACTIVE") :
                            react_1.default.createElement(ink_1.Text, { color: "yellow" }, "STANDBY"))),
                selectedGroup === group.id && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, null, "Coverage Areas:"),
                        group.coverage.map((area, index) => (react_1.default.createElement(ink_1.Text, { key: index },
                            "- ",
                            area)))),
                    react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                        react_1.default.createElement(ink_1.Text, null, "Backup Nodes:"),
                        backupNodes.length > 0 ? (backupNodes.map((node, index) => (react_1.default.createElement(ink_1.Text, { key: index },
                            "- ",
                            node.name,
                            " (",
                            getNodeStatusColor(node.status),
                            ")")))) : (react_1.default.createElement(ink_1.Text, { color: "red" }, "No backup nodes assigned!"))),
                    backupNodes.length > 0 && (react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                        react_1.default.createElement(ink_1.Box, { backgroundColor: group.activeBackup ? "red" : "green", paddingX: 2, paddingY: 1, onPress: () => toggleNodeBackup(group.primaryNodeId) },
                            react_1.default.createElement(ink_1.Text, { color: "white" }, group.activeBackup ? "Deactivate Backup" : "Activate Backup"))))))));
        })),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the simulation screen
    const renderSimulationScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "HARN Outage Simulation")),
        isProcessing ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "yellow" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Simulating ",
                simulationMode.replace('_', ' '),
                "..."),
            react_1.default.createElement(ink_1.Text, null,
                "Progress: ",
                simulationProgress,
                "%"),
            react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < simulationProgress / 2 ? '█' : '░').join(''))),
            simulationMode === 'SOLAR_FLARE' && (react_1.default.createElement(ink_1.Text, null, "Solar radiation increasing... geostationary nodes affected...")),
            simulationMode === 'OUTAGE' && (react_1.default.createElement(ink_1.Text, null, "Node connection dropping... initiating failover protocol...")),
            simulationMode === 'INSPECTION' && (react_1.default.createElement(ink_1.Text, null, "Government inspection detected... activating stealth protocols...")))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Select a scenario to test backup systems:")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, simulationItems.map(item => (react_1.default.createElement(ink_1.Box, { key: item.value, flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, item.label),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    item.value === 'SOLAR_FLARE' && (react_1.default.createElement(ink_1.Text, null, "Simulates radiation disruption to geostationary nodes")),
                    item.value === 'OUTAGE' && (react_1.default.createElement(ink_1.Text, null, "Simulates sudden failure of a random relay node")),
                    item.value === 'INSPECTION' && (react_1.default.createElement(ink_1.Text, null, "Simulates government monitoring with stealth mode activation"))),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "yellow", paddingX: 2, paddingY: 1, onPress: () => runSimulation(item.value) },
                        react_1.default.createElement(ink_1.Text, { color: "black" }, "Run Simulation"))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Render the alert screen
    const renderAlertScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "red" }, "\u26A0\uFE0F HARN ALERT")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "double", borderColor: "red", paddingX: 2, paddingY: 1, marginY: 2 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" }, alertMessage)),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, null, "The system is automatically responding to this event."),
            react_1.default.createElement(ink_1.Text, null, "Backup systems are being engaged according to protocol.")),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => {
                        setActiveScreen('NODES');
                        setAlertMode(false);
                    } }, "View Nodes")))));
    if (activeScreen === 'NODES') {
        return renderNodesScreen();
    }
    if (activeScreen === 'GROUPS') {
        return renderGroupsScreen();
    }
    if (activeScreen === 'SIMULATE') {
        return renderSimulationScreen();
    }
    if (activeScreen === 'ALERT') {
        return renderAlertScreen();
    }
    return renderMenuScreen();
};
exports.default = HARNManager;

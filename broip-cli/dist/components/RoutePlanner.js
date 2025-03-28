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
const RouteVisualizer_1 = __importDefault(require("./RouteVisualizer"));
const RoutePlanner = ({ onReturn }) => {
    const [view, setView] = (0, react_1.useState)('MENU');
    const [network, setNetwork] = (0, react_1.useState)({
        nodes: new Map([
            ['start', {
                    id: 'start',
                    name: 'Home Bong',
                    type: 'BONG',
                    status: 'ACTIVE',
                    coordinates: { x: 5, y: 5 },
                    connections: ['router1', 'router2'],
                    properties: {
                        percolation: 95,
                        milkDensity: 80,
                        dragCoefficient: 0.7
                    }
                }],
            ['router1', {
                    id: 'router1',
                    name: 'Main Hub',
                    type: 'ROUTER',
                    status: 'ACTIVE',
                    coordinates: { x: 10, y: 5 },
                    connections: ['start', 'end', 'router3'],
                    properties: {
                        latency: 15
                    }
                }],
            ['router2', {
                    id: 'router2',
                    name: 'Backup Router',
                    type: 'ROUTER',
                    status: 'ACTIVE',
                    coordinates: { x: 7, y: 9 },
                    connections: ['start', 'router3'],
                    properties: {
                        latency: 8
                    }
                }],
            ['router3', {
                    id: 'router3',
                    name: 'High-Altitude Relay',
                    type: 'ROUTER',
                    status: 'MAINTENANCE',
                    coordinates: { x: 12, y: 10 },
                    connections: ['router1', 'router2', 'end'],
                    properties: {
                        latency: 25
                    }
                }],
            ['end', {
                    id: 'end',
                    name: 'Friend\'s Rig',
                    type: 'DAB_RIG',
                    status: 'ACTIVE',
                    coordinates: { x: 17, y: 7 },
                    connections: ['router1', 'router3'],
                    properties: {
                        percolation: 88,
                        milkDensity: 92,
                        dragCoefficient: 0.5
                    }
                }]
        ]),
        routes: []
    });
    const [selectedStartNode, setSelectedStartNode] = (0, react_1.useState)(null);
    const [selectedEndNode, setSelectedEndNode] = (0, react_1.useState)(null);
    const [isOptimizing, setIsOptimizing] = (0, react_1.useState)(false);
    const [optimizationProgress, setOptimizationProgress] = (0, react_1.useState)(0);
    const [selectedRoute, setSelectedRoute] = (0, react_1.useState)(null);
    // Create a default route
    (0, react_1.useEffect)(() => {
        if (network.routes.length === 0) {
            createRoute('start', 'end');
        }
    }, []);
    const calculateRoute = (start, end) => {
        const visited = new Set();
        const queue = [{ node: start, path: [start.id] }];
        while (queue.length > 0) {
            const { node, path } = queue.shift();
            if (node.id === end.id) {
                return path;
            }
            if (!visited.has(node.id)) {
                visited.add(node.id);
                for (const connId of node.connections) {
                    const nextNode = network.nodes.get(connId);
                    if (nextNode && !visited.has(nextNode.id)) {
                        queue.push({
                            node: nextNode,
                            path: [...path, nextNode.id]
                        });
                    }
                }
            }
        }
        return [];
    };
    const calculateAllPossibleRoutes = (start, end, maxDepth = 10) => {
        const allRoutes = [];
        const visited = new Set();
        const findRoutes = (currentNode, path, depth) => {
            if (depth > maxDepth)
                return;
            path.push(currentNode.id);
            if (currentNode.id === end.id) {
                allRoutes.push([...path]);
            }
            else if (depth < maxDepth) {
                visited.add(currentNode.id);
                for (const connId of currentNode.connections) {
                    const nextNode = network.nodes.get(connId);
                    if (nextNode && !visited.has(nextNode.id)) {
                        findRoutes(nextNode, [...path], depth + 1);
                    }
                }
                visited.delete(currentNode.id);
            }
        };
        findRoutes(start, [], 0);
        return allRoutes;
    };
    const createRoute = (start, end) => {
        const startNode = network.nodes.get(start);
        const endNode = network.nodes.get(end);
        if (startNode && endNode) {
            const path = calculateRoute(startNode, endNode);
            if (path.length > 0) {
                // Calculate metrics based on the node properties
                let totalLatency = 0;
                let totalDensity = 0;
                let reliability = 100;
                for (let i = 0; i < path.length; i++) {
                    const nodeId = path[i];
                    const node = network.nodes.get(nodeId);
                    if (node) {
                        // Add node latency
                        totalLatency += node.properties?.latency || 10;
                        // Calculate milk density impact
                        if (node.properties?.milkDensity) {
                            totalDensity += node.properties.milkDensity;
                        }
                        // Status affects reliability
                        if (node.status === 'MAINTENANCE') {
                            reliability -= 15;
                        }
                        else if (node.status === 'INACTIVE') {
                            reliability -= 30;
                        }
                        // Connection reliability impact
                        if (i < path.length - 1) {
                            reliability -= 2; // Each hop reduces reliability slightly
                        }
                    }
                }
                // Average the milk density
                const avgMilkDensity = totalDensity / path.length;
                // Create the route object
                const route = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: `${startNode.name} → ${endNode.name}`,
                    nodes: path,
                    status: 'ACTIVE',
                    metrics: {
                        totalLatency: totalLatency,
                        avgMilkDensity: avgMilkDensity,
                        hopCount: path.length - 1,
                        reliability: Math.max(0, Math.min(100, reliability))
                    }
                };
                setNetwork(prev => ({
                    ...prev,
                    routes: [...prev.routes, route],
                    activeRoute: route.id
                }));
                return route;
            }
        }
        return null;
    };
    const deleteRoute = (routeId) => {
        setNetwork(prev => ({
            ...prev,
            routes: prev.routes.filter(r => r.id !== routeId),
            activeRoute: prev.routes.length > 1 ?
                (prev.activeRoute === routeId ? prev.routes[0].id : prev.activeRoute) : undefined
        }));
        if (selectedRoute === routeId) {
            setSelectedRoute(null);
        }
    };
    const optimizeRoute = (routeId) => {
        const route = network.routes.find(r => r.id === routeId);
        if (!route)
            return;
        setIsOptimizing(true);
        setOptimizationProgress(0);
        // Simulate optimization progress
        const timer = setInterval(() => {
            setOptimizationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    finishOptimization(route);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };
    const finishOptimization = (route) => {
        const startNode = network.nodes.get(route.nodes[0]);
        const endNode = network.nodes.get(route.nodes[route.nodes.length - 1]);
        if (startNode && endNode) {
            // Find alternative paths
            const allRoutes = calculateAllPossibleRoutes(startNode, endNode, 8);
            if (allRoutes.length > 0) {
                // Sort routes by a heuristic (we'll use path length as a simple metric)
                const bestRoute = allRoutes
                    .sort((a, b) => {
                    // Calculate some basic metrics for comparison
                    const aLatency = a.length * 10; // Simple heuristic
                    const bLatency = b.length * 10;
                    return aLatency - bLatency;
                })[0];
                // Create an optimized route
                let totalLatency = 0;
                let totalDensity = 0;
                for (const nodeId of bestRoute) {
                    const node = network.nodes.get(nodeId);
                    if (node) {
                        totalLatency += node.properties?.latency || 10;
                        totalDensity += node.properties?.milkDensity || 50;
                    }
                }
                const optimizedRoute = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: `${route.name} (Optimized)`,
                    nodes: bestRoute,
                    status: 'ACTIVE',
                    metrics: {
                        totalLatency: totalLatency,
                        avgMilkDensity: totalDensity / bestRoute.length,
                        hopCount: bestRoute.length - 1,
                        reliability: 100 - (bestRoute.length * 3)
                    }
                };
                setNetwork(prev => ({
                    ...prev,
                    routes: [...prev.routes, optimizedRoute],
                    activeRoute: optimizedRoute.id
                }));
                setSelectedRoute(optimizedRoute.id);
            }
        }
        setIsOptimizing(false);
    };
    const handleVisualizerReturn = () => {
        setView('MENU');
    };
    const handleNodeSelect = (nodeId, role) => {
        if (role === 'start') {
            setSelectedStartNode(nodeId);
        }
        else {
            setSelectedEndNode(nodeId);
        }
    };
    const handleCreateRoute = () => {
        if (selectedStartNode && selectedEndNode) {
            const route = createRoute(selectedStartNode, selectedEndNode);
            if (route) {
                setSelectedRoute(route.id);
                setView('ROUTES');
            }
        }
    };
    const menuItems = [
        {
            label: '🗺️  View Network Map',
            value: 'visualizer'
        },
        {
            label: '🛣️  Manage Routes',
            value: 'routes'
        },
        {
            label: '🚀  Create New Route',
            value: 'create'
        },
        {
            label: '⚙️  Route Optimization',
            value: 'optimize'
        },
        {
            label: '↩️  Return to Main Menu',
            value: 'return'
        }
    ];
    const getNodeSelectItems = (role) => {
        const items = [];
        for (const [id, node] of network.nodes.entries()) {
            // Filter out nodes that aren't sensible for the role
            if (role === 'start' && node.type === 'ENDPOINT')
                continue;
            if (role === 'end' && node.type === 'BONG')
                continue;
            items.push({
                label: `${getNodeIcon(node.type)} ${node.name} (${node.status})`,
                value: id
            });
        }
        return items;
    };
    const getNodeIcon = (type) => {
        switch (type) {
            case 'BONG': return '🌿';
            case 'PIPE': return '📏';
            case 'DAB_RIG': return '💎';
            case 'ROUTER': return '🔄';
            case 'ENDPOINT': return '🎯';
            default: return '◉';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'green';
            case 'INACTIVE': return 'red';
            case 'MAINTENANCE': return 'yellow';
            case 'PLANNING': return 'blue';
            case 'FAILED': return 'red';
            default: return 'white';
        }
    };
    const renderNodeSelection = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Select Start Node:")),
        react_1.default.createElement(ink_select_input_1.default, { items: getNodeSelectItems('start'), onSelect: (item) => handleNodeSelect(item.value, 'start') }),
        selectedStartNode && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Select End Node:")),
            react_1.default.createElement(ink_select_input_1.default, { items: getNodeSelectItems('end'), onSelect: (item) => handleNodeSelect(item.value, 'end') }))),
        selectedStartNode && selectedEndNode && (react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: handleCreateRoute }, "Create Route")))),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, { dimColor: true }, "Press 'x' to return to menu"))));
    const renderRoutesList = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Text, { bold: true }, "BROIP Active Routes"),
        network.routes.length === 0 ? (react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, null, "No routes configured. Create a new route first."))) : (network.routes.map((route, i) => (react_1.default.createElement(ink_1.Box, { key: i, marginY: 1, borderStyle: selectedRoute === route.id ? "double" : "single", paddingX: 1, paddingY: 1, flexDirection: "column" },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, route.name),
                react_1.default.createElement(ink_1.Text, null, " - "),
                react_1.default.createElement(ink_1.Text, { color: getStatusColor(route.status) }, route.status)),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, { color: "yellow" },
                    route.metrics.hopCount,
                    " hops"),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, { color: "cyan" },
                    route.metrics.avgMilkDensity.toFixed(1),
                    "% density"),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, { color: route.metrics.reliability > 80 ? "green" : "red" },
                    route.metrics.reliability.toFixed(1),
                    "% reliable")),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null, route.nodes.map(n => network.nodes.get(n)?.name).join(' → '))),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", color: "white", paddingX: 1, marginRight: 1, onPress: () => {
                        setSelectedRoute(route.id);
                        setNetwork(prev => ({ ...prev, activeRoute: route.id }));
                        setView('VISUALIZER');
                    } },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Visualize")),
                react_1.default.createElement(ink_1.Box, { backgroundColor: "yellow", paddingX: 1, marginRight: 1, onPress: () => {
                        setSelectedRoute(route.id);
                        setView('OPTIMIZE');
                    } },
                    react_1.default.createElement(ink_1.Text, { color: "black" }, "Optimize")),
                react_1.default.createElement(ink_1.Box, { backgroundColor: "red", paddingX: 1, onPress: () => deleteRoute(route.id) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Delete"))))))),
        react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "row" },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, marginRight: 2, onPress: () => setView('CREATE') },
                react_1.default.createElement(ink_1.Text, { color: "white" }, "Add Route")),
            react_1.default.createElement(ink_1.Box, { backgroundColor: "gray", paddingX: 2, paddingY: 1, onPress: () => setView('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "white" }, "Back")))));
    const renderOptimization = () => {
        const route = network.routes.find(r => r.id === selectedRoute);
        if (!route) {
            return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null, "No route selected for optimization"),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "gray", paddingX: 2, paddingY: 1, onPress: () => setView('ROUTES') },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Back to Routes")))));
        }
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Route Optimization"),
            react_1.default.createElement(ink_1.Box, { marginY: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Optimizing: ",
                    react_1.default.createElement(ink_1.Text, { bold: true }, route.name))),
            isOptimizing ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        react_1.default.createElement(ink_1.Text, { color: "green" },
                            react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                        ' ',
                        "Applying Terpene Compression Algorithms...")),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "Progress: ",
                        optimizationProgress,
                        "%")),
                react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < optimizationProgress / 2 ? '█' : '░').join(''))))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Current Route Metrics:"),
                    react_1.default.createElement(ink_1.Text, null,
                        "- Latency: ",
                        react_1.default.createElement(ink_1.Text, { color: "yellow" },
                            route.metrics.totalLatency.toFixed(0),
                            " ms")),
                    react_1.default.createElement(ink_1.Text, null,
                        "- Density: ",
                        react_1.default.createElement(ink_1.Text, { color: "cyan" },
                            route.metrics.avgMilkDensity.toFixed(1),
                            "%")),
                    react_1.default.createElement(ink_1.Text, null,
                        "- Hops: ",
                        route.metrics.hopCount),
                    react_1.default.createElement(ink_1.Text, null,
                        "- Reliability: ",
                        react_1.default.createElement(ink_1.Text, { color: route.metrics.reliability > 80 ? "green" : "red" },
                            route.metrics.reliability.toFixed(1),
                            "%"))),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, marginRight: 2, onPress: () => optimizeRoute(route.id) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Start Optimization")),
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "gray", paddingX: 2, paddingY: 1, onPress: () => setView('ROUTES') },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Back")))))));
    };
    (0, ink_1.useInput)((input) => {
        if (input.toLowerCase() === 'x' && view !== 'MENU' && view !== 'VISUALIZER') {
            setView('MENU');
        }
    });
    if (view === 'VISUALIZER') {
        return (react_1.default.createElement(RouteVisualizer_1.default, { network: network, onUpdateNetwork: setNetwork, onReturn: handleVisualizerReturn }));
    }
    if (view === 'ROUTES') {
        return renderRoutesList();
    }
    if (view === 'CREATE') {
        return renderNodeSelection();
    }
    if (view === 'OPTIMIZE') {
        return renderOptimization();
    }
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP Route Planner v4.20")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Plan and optimize your smoke delivery routes")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, { dimColor: true }, "Network Status: "),
            react_1.default.createElement(ink_1.Text, { color: "green" }, "OPTIMAL"),
            react_1.default.createElement(ink_1.Text, { dimColor: true }, " \u2022 "),
            react_1.default.createElement(ink_1.Text, null,
                network.nodes.size,
                " Nodes"),
            react_1.default.createElement(ink_1.Text, { dimColor: true }, " \u2022 "),
            react_1.default.createElement(ink_1.Text, null,
                network.routes.length,
                " Routes"),
            network.routes.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Text, { dimColor: true }, " \u2022 "),
                react_1.default.createElement(ink_1.Text, { color: "yellow" },
                    "Avg. Latency: ",
                    (network.routes.reduce((sum, route) => sum + route.metrics.totalLatency, 0) / network.routes.length).toFixed(0),
                    " ms")))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: (item) => {
                if (item.value === 'return') {
                    onReturn();
                }
                else {
                    setView(item.value);
                }
            } })));
};
exports.default = RoutePlanner;

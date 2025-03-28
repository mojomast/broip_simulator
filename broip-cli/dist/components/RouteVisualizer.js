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
const RouteVisualizer = ({ onReturn, network, onUpdateNetwork, }) => {
    const [selectedNode, setSelectedNode] = (0, react_1.useState)(null);
    const [cursorPos, setCursorPos] = (0, react_1.useState)({ x: 0, y: 0 });
    const [mode, setMode] = (0, react_1.useState)('VIEW');
    const [message, setMessage] = (0, react_1.useState)('');
    const [activeRouteIndex, setActiveRouteIndex] = (0, react_1.useState)(null);
    const GRID_WIDTH = 40;
    const GRID_HEIGHT = 20;
    // Initialize with the first route as active if available
    (0, react_1.useEffect)(() => {
        if (network.routes.length > 0 && activeRouteIndex === null) {
            setActiveRouteIndex(0);
        }
    }, [network.routes]);
    (0, ink_1.useInput)((input, key) => {
        if (input === 'q') {
            onReturn();
            return;
        }
        if (mode === 'VIEW') {
            switch (input) {
                case 'e':
                    setMode('EDIT');
                    setMessage('EDIT MODE: Use arrows to move cursor, space to select/deselect nodes');
                    break;
                case 'a':
                    setMode('ADD');
                    setMessage('ADD MODE: Use arrows to position, space to place new node');
                    break;
                case 'd':
                    setMode('DELETE');
                    setMessage('DELETE MODE: Move cursor to node and press space to delete');
                    break;
                case 'r':
                    // Cycle through routes
                    if (network.routes.length > 0) {
                        setActiveRouteIndex(prev => prev === null ? 0 : (prev + 1) % network.routes.length);
                    }
                    break;
                case 'n':
                    createNewRouteFromSelectedNodes();
                    break;
            }
        }
        else if (input === 'v') {
            // Return to view mode from any other mode
            setMode('VIEW');
            setMessage('VIEW MODE: Press (e)dit, (a)dd node, (d)elete, (r) cycle routes, (n)ew route');
            setSelectedNode(null);
        }
        if (key.upArrow) {
            setCursorPos(prev => ({ ...prev, y: Math.max(0, prev.y - 1) }));
        }
        if (key.downArrow) {
            setCursorPos(prev => ({ ...prev, y: Math.min(GRID_HEIGHT - 1, prev.y + 1) }));
        }
        if (key.leftArrow) {
            setCursorPos(prev => ({ ...prev, x: Math.max(0, prev.x - 1) }));
        }
        if (key.rightArrow) {
            setCursorPos(prev => ({ ...prev, x: Math.min(GRID_WIDTH - 1, prev.x + 1) }));
        }
        if (input === ' ') {
            handleSpacePress();
        }
    });
    const handleSpacePress = () => {
        if (mode === 'ADD') {
            addNewNode();
        }
        else if (mode === 'EDIT') {
            handleNodeSelection();
        }
        else if (mode === 'DELETE') {
            deleteNodeAtCursor();
        }
    };
    const addNewNode = () => {
        // Check if position is already occupied
        if (findNodeAtPosition(cursorPos)) {
            setMessage('Position already occupied by another node!');
            return;
        }
        const nodeTypes = ['BONG', 'PIPE', 'DAB_RIG', 'ROUTER', 'ENDPOINT'];
        const randomType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        const newNode = {
            id: Math.random().toString(36).substr(2, 9),
            name: `${randomType}-${Math.floor(Math.random() * 1000)}`,
            type: randomType,
            status: 'ACTIVE',
            coordinates: { ...cursorPos },
            connections: [],
            properties: {
                latency: Math.floor(Math.random() * 50) + 5,
                milkDensity: Math.floor(Math.random() * 100),
                dragCoefficient: Math.random() * 0.9 + 0.1,
                percolation: Math.floor(Math.random() * 100),
            }
        };
        const updatedNodes = new Map(network.nodes);
        updatedNodes.set(newNode.id, newNode);
        onUpdateNetwork({
            ...network,
            nodes: updatedNodes
        });
        setMessage(`Added new ${randomType} node at (${cursorPos.x},${cursorPos.y})`);
    };
    const handleNodeSelection = () => {
        const nodeAtCursor = findNodeAtPosition(cursorPos);
        if (nodeAtCursor) {
            if (selectedNode && selectedNode !== nodeAtCursor.id) {
                // Connect nodes
                const node1 = network.nodes.get(selectedNode);
                const node2 = nodeAtCursor;
                if (node1 && node2) {
                    if (!node1.connections.includes(node2.id)) {
                        const updatedNodes = new Map(network.nodes);
                        node1.connections.push(node2.id);
                        node2.connections.push(node1.id);
                        updatedNodes.set(node1.id, node1);
                        updatedNodes.set(node2.id, node2);
                        onUpdateNetwork({
                            ...network,
                            nodes: updatedNodes
                        });
                        setMessage(`Connected ${node1.name} to ${node2.name}`);
                    }
                    else {
                        setMessage('Nodes are already connected!');
                    }
                }
                setSelectedNode(null);
            }
            else {
                setSelectedNode(nodeAtCursor.id);
                setMessage(`Selected ${nodeAtCursor.name} (${nodeAtCursor.type})`);
            }
        }
        else {
            setMessage('No node at cursor position');
        }
    };
    const deleteNodeAtCursor = () => {
        const nodeAtCursor = findNodeAtPosition(cursorPos);
        if (nodeAtCursor) {
            // Remove all connections to this node
            const updatedNodes = new Map(network.nodes);
            // Remove this node from all other nodes' connections
            updatedNodes.forEach(node => {
                if (node.connections.includes(nodeAtCursor.id)) {
                    node.connections = node.connections.filter(id => id !== nodeAtCursor.id);
                    updatedNodes.set(node.id, node);
                }
            });
            // Delete the node itself
            updatedNodes.delete(nodeAtCursor.id);
            // Update routes to remove this node
            const updatedRoutes = network.routes.filter(route => !route.nodes.includes(nodeAtCursor.id));
            onUpdateNetwork({
                nodes: updatedNodes,
                routes: updatedRoutes,
                activeRoute: network.activeRoute
            });
            setMessage(`Deleted node ${nodeAtCursor.name}`);
            if (selectedNode === nodeAtCursor.id) {
                setSelectedNode(null);
            }
        }
        else {
            setMessage('No node at cursor position');
        }
    };
    const createNewRouteFromSelectedNodes = () => {
        // Prompt for start and end nodes
        setMessage('Select start node (press space)');
        let startNodeId = null;
        let endNodeId = null;
        // This is simplified - in a real implementation you'd need a more robust UI flow
        const nodeAtCursor = findNodeAtPosition(cursorPos);
        if (nodeAtCursor) {
            if (!startNodeId) {
                startNodeId = nodeAtCursor.id;
                setMessage('Now select end node (press space)');
            }
            else {
                endNodeId = nodeAtCursor.id;
                if (startNodeId && endNodeId) {
                    const startNode = network.nodes.get(startNodeId);
                    const endNode = network.nodes.get(endNodeId);
                    if (startNode && endNode) {
                        const path = calculateRoute(startNode, endNode);
                        if (path.length > 0) {
                            const newRoute = createRoute(startNodeId, endNodeId);
                            setMessage(`Created new route: ${newRoute.name}`);
                        }
                        else {
                            setMessage('No valid path between nodes');
                        }
                    }
                }
            }
        }
    };
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
    const createRoute = (start, end) => {
        const startNode = network.nodes.get(start);
        const endNode = network.nodes.get(end);
        let route = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'Invalid Route',
            nodes: [],
            status: 'FAILED',
            metrics: {
                totalLatency: 0,
                avgMilkDensity: 0,
                hopCount: 0,
                reliability: 0
            }
        };
        if (startNode && endNode) {
            const path = calculateRoute(startNode, endNode);
            if (path.length > 0) {
                // Calculate realistic metrics based on node properties
                let totalLatency = 0;
                let totalMilkDensity = 0;
                let nodeCount = 0;
                for (const nodeId of path) {
                    const node = network.nodes.get(nodeId);
                    if (node) {
                        totalLatency += node.properties?.latency || 10;
                        totalMilkDensity += node.properties?.milkDensity || 50;
                        nodeCount++;
                    }
                }
                route = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: `${startNode.name} → ${endNode.name}`,
                    nodes: path,
                    status: 'ACTIVE',
                    metrics: {
                        totalLatency: totalLatency,
                        avgMilkDensity: totalMilkDensity / nodeCount,
                        hopCount: path.length - 1,
                        reliability: 100 - (path.length * 5) // Longer routes are less reliable
                    }
                };
                // Add route to network
                onUpdateNetwork({
                    ...network,
                    routes: [...network.routes, route],
                    activeRoute: route.id
                });
                // Update active route index to show the new route
                setActiveRouteIndex(network.routes.length);
            }
        }
        return route;
    };
    const findNodeAtPosition = (pos) => {
        for (const node of network.nodes.values()) {
            if (node.coordinates.x === pos.x && node.coordinates.y === pos.y) {
                return node;
            }
        }
        return null;
    };
    const getNodeSymbol = (node) => {
        switch (node.type) {
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
            default: return 'white';
        }
    };
    const isNodeInActiveRoute = (nodeId) => {
        if (activeRouteIndex === null || activeRouteIndex >= network.routes.length) {
            return false;
        }
        return network.routes[activeRouteIndex].nodes.includes(nodeId);
    };
    const isConnectionInActiveRoute = (node1Id, node2Id) => {
        if (activeRouteIndex === null || activeRouteIndex >= network.routes.length) {
            return false;
        }
        const route = network.routes[activeRouteIndex];
        const nodes = route.nodes;
        for (let i = 0; i < nodes.length - 1; i++) {
            if ((nodes[i] === node1Id && nodes[i + 1] === node2Id) ||
                (nodes[i] === node2Id && nodes[i + 1] === node1Id)) {
                return true;
            }
        }
        return false;
    };
    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < GRID_WIDTH; x++) {
                const nodeAtPos = findNodeAtPosition({ x, y });
                if (nodeAtPos) {
                    // Render a node
                    const isInActiveRoute = isNodeInActiveRoute(nodeAtPos.id);
                    let bgColor = undefined;
                    if (selectedNode === nodeAtPos.id) {
                        bgColor = 'yellow';
                    }
                    else if (isInActiveRoute) {
                        bgColor = 'cyan';
                    }
                    row.push(react_1.default.createElement(ink_1.Text, { key: `node-${x}-${y}`, color: getStatusColor(nodeAtPos.status), backgroundColor: bgColor }, getNodeSymbol(nodeAtPos)));
                }
                else {
                    // Check if we need to render a connection here
                    let hasConnection = false;
                    let isRouteConnection = false;
                    // Complex connection rendering logic would go here
                    // For simplicity, we'll just render cursor or empty space
                    if (x === cursorPos.x && y === cursorPos.y) {
                        row.push(react_1.default.createElement(ink_1.Text, { key: `cursor-${x}-${y}`, color: "magenta" }, "+"));
                    }
                    else {
                        row.push(react_1.default.createElement(ink_1.Text, { key: `empty-${x}-${y}` }, " "));
                    }
                }
            }
            grid.push(react_1.default.createElement(ink_1.Box, { key: `row-${y}` }, row));
        }
        // Render node connections
        for (const node of network.nodes.values()) {
            for (const connId of node.connections) {
                const targetNode = network.nodes.get(connId);
                if (targetNode) {
                    const isInRoute = isConnectionInActiveRoute(node.id, targetNode.id);
                    // We'd need more complex rendering logic here for proper connections
                    // This is simplified
                }
            }
        }
        return grid;
    };
    const renderRouteInfo = () => {
        if (activeRouteIndex === null || network.routes.length === 0) {
            return react_1.default.createElement(ink_1.Text, null, "No active route selected");
        }
        const route = network.routes[activeRouteIndex];
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginTop: 1, borderStyle: "single" },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Route: ",
                route.name),
            react_1.default.createElement(ink_1.Text, null,
                "Status: ",
                react_1.default.createElement(ink_1.Text, { color: route.status === 'ACTIVE' ? 'green' : 'red' }, route.status)),
            react_1.default.createElement(ink_1.Text, null, "Metrics:"),
            react_1.default.createElement(ink_1.Text, null,
                " - Latency: ",
                react_1.default.createElement(ink_1.Text, { color: "yellow" },
                    route.metrics.totalLatency.toFixed(0),
                    " ms")),
            react_1.default.createElement(ink_1.Text, null,
                " - Density: ",
                react_1.default.createElement(ink_1.Text, { color: "cyan" },
                    route.metrics.avgMilkDensity.toFixed(1),
                    "%")),
            react_1.default.createElement(ink_1.Text, null,
                " - Hops: ",
                route.metrics.hopCount),
            react_1.default.createElement(ink_1.Text, null,
                " - Reliability: ",
                react_1.default.createElement(ink_1.Text, { color: route.metrics.reliability > 80 ? 'green' : 'red' },
                    route.metrics.reliability.toFixed(1),
                    "%"))));
    };
    const renderLegend = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginTop: 1, borderStyle: "single" },
        react_1.default.createElement(ink_1.Text, { bold: true }, "Controls:"),
        react_1.default.createElement(ink_1.Text, null, "Arrows: Move cursor"),
        react_1.default.createElement(ink_1.Text, null, "Space: Select/place"),
        react_1.default.createElement(ink_1.Text, null, "(v)iew, (e)dit, (a)dd, (d)elete modes"),
        react_1.default.createElement(ink_1.Text, null, "(r)otate routes, (n)ew route, (q)uit"),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Node Types: "),
            react_1.default.createElement(ink_1.Text, null, "\uD83C\uDF3F BONG "),
            react_1.default.createElement(ink_1.Text, null, "\uD83D\uDCCF PIPE "),
            react_1.default.createElement(ink_1.Text, null, "\uD83D\uDC8E DAB_RIG "),
            react_1.default.createElement(ink_1.Text, null, "\uD83D\uDD04 ROUTER "),
            react_1.default.createElement(ink_1.Text, null, "\uD83C\uDFAF ENDPOINT"))));
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP Network Visualizer v4.20"),
            react_1.default.createElement(ink_1.Text, null, " | "),
            react_1.default.createElement(ink_1.Text, null, "Mode: "),
            react_1.default.createElement(ink_1.Text, { color: "yellow" }, mode)),
        message && (react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 1 },
            react_1.default.createElement(ink_1.Text, { color: "cyan" }, message))),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single" }, renderGrid()),
        react_1.default.createElement(ink_1.Box, { flexDirection: "row", marginTop: 1 },
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", width: "60%" }, renderRouteInfo()),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginLeft: 2, width: "40%" }, renderLegend()))));
};
exports.default = RouteVisualizer;

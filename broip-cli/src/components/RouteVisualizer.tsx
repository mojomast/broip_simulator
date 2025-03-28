import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { RouteNode, Route, NetworkGraph } from '../utils/routeTypes';

interface RouteVisualizerProps {
    onReturn: () => void;
    network: NetworkGraph;
    onUpdateNetwork: (network: NetworkGraph) => void;
}

const RouteVisualizer: React.FC<RouteVisualizerProps> = ({
    onReturn,
    network,
    onUpdateNetwork,
}) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [mode, setMode] = useState<'VIEW' | 'EDIT' | 'ADD' | 'DELETE'>('VIEW');
    const [message, setMessage] = useState('');
    const [activeRouteIndex, setActiveRouteIndex] = useState<number | null>(null);
    
    const GRID_WIDTH = 40;
    const GRID_HEIGHT = 20;

    // Initialize with the first route as active if available
    useEffect(() => {
        if (network.routes.length > 0 && activeRouteIndex === null) {
            setActiveRouteIndex(0);
        }
    }, [network.routes]);

    useInput((input, key) => {
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
                        setActiveRouteIndex(prev => 
                            prev === null ? 0 : (prev + 1) % network.routes.length
                        );
                    }
                    break;
                case 'n':
                    createNewRouteFromSelectedNodes();
                    break;
            }
        } else if (input === 'v') {
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
        } else if (mode === 'EDIT') {
            handleNodeSelection();
        } else if (mode === 'DELETE') {
            deleteNodeAtCursor();
        }
    };

    const addNewNode = () => {
        // Check if position is already occupied
        if (findNodeAtPosition(cursorPos)) {
            setMessage('Position already occupied by another node!');
            return;
        }

        const nodeTypes: Array<RouteNode['type']> = ['BONG', 'PIPE', 'DAB_RIG', 'ROUTER', 'ENDPOINT'];
        const randomType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        
        const newNode: RouteNode = {
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
                    } else {
                        setMessage('Nodes are already connected!');
                    }
                }
                setSelectedNode(null);
            } else {
                setSelectedNode(nodeAtCursor.id);
                setMessage(`Selected ${nodeAtCursor.name} (${nodeAtCursor.type})`);
            }
        } else {
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
            const updatedRoutes = network.routes.filter(route => 
                !route.nodes.includes(nodeAtCursor.id)
            );
            
            onUpdateNetwork({
                nodes: updatedNodes,
                routes: updatedRoutes,
                activeRoute: network.activeRoute
            });
            
            setMessage(`Deleted node ${nodeAtCursor.name}`);
            if (selectedNode === nodeAtCursor.id) {
                setSelectedNode(null);
            }
        } else {
            setMessage('No node at cursor position');
        }
    };

    const createNewRouteFromSelectedNodes = () => {
        // Prompt for start and end nodes
        setMessage('Select start node (press space)');
        let startNodeId: string | null = null;
        let endNodeId: string | null = null;
        
        // This is simplified - in a real implementation you'd need a more robust UI flow
        const nodeAtCursor = findNodeAtPosition(cursorPos);
        if (nodeAtCursor) {
            if (!startNodeId) {
                startNodeId = nodeAtCursor.id;
                setMessage('Now select end node (press space)');
            } else {
                endNodeId = nodeAtCursor.id;
                
                if (startNodeId && endNodeId) {
                    const startNode = network.nodes.get(startNodeId);
                    const endNode = network.nodes.get(endNodeId);
                    
                    if (startNode && endNode) {
                        const path = calculateRoute(startNode, endNode);
                        if (path.length > 0) {
                            const newRoute = createRoute(startNodeId, endNodeId);
                            setMessage(`Created new route: ${newRoute.name}`);
                        } else {
                            setMessage('No valid path between nodes');
                        }
                    }
                }
            }
        }
    };

    const calculateRoute = (start: RouteNode, end: RouteNode): string[] => {
        const visited = new Set<string>();
        const queue: { node: RouteNode; path: string[] }[] = [{ node: start, path: [start.id] }];
        
        while (queue.length > 0) {
            const { node, path } = queue.shift()!;
            
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

    const createRoute = (start: string, end: string): Route => {
        const startNode = network.nodes.get(start);
        const endNode = network.nodes.get(end);
        
        let route: Route = {
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

    const findNodeAtPosition = (pos: { x: number; y: number }): RouteNode | null => {
        for (const node of network.nodes.values()) {
            if (node.coordinates.x === pos.x && node.coordinates.y === pos.y) {
                return node;
            }
        }
        return null;
    };

    const getNodeSymbol = (node: RouteNode): string => {
        switch (node.type) {
            case 'BONG': return '🌿';
            case 'PIPE': return '📏';
            case 'DAB_RIG': return '💎';
            case 'ROUTER': return '🔄';
            case 'ENDPOINT': return '🎯';
            default: return '◉';
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'ACTIVE': return 'green';
            case 'INACTIVE': return 'red';
            case 'MAINTENANCE': return 'yellow';
            default: return 'white';
        }
    };

    const isNodeInActiveRoute = (nodeId: string): boolean => {
        if (activeRouteIndex === null || activeRouteIndex >= network.routes.length) {
            return false;
        }
        return network.routes[activeRouteIndex].nodes.includes(nodeId);
    };

    const isConnectionInActiveRoute = (node1Id: string, node2Id: string): boolean => {
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
        const grid: JSX.Element[] = [];

        for (let y = 0; y < GRID_HEIGHT; y++) {
            const row: JSX.Element[] = [];
            
            for (let x = 0; x < GRID_WIDTH; x++) {
                const nodeAtPos = findNodeAtPosition({ x, y });
                
                if (nodeAtPos) {
                    // Render a node
                    const isInActiveRoute = isNodeInActiveRoute(nodeAtPos.id);
                    let bgColor: string | undefined = undefined;
                    
                    if (selectedNode === nodeAtPos.id) {
                        bgColor = 'yellow';
                    } else if (isInActiveRoute) {
                        bgColor = 'cyan';
                    }
                    
                    row.push(
                        <Text 
                            key={`node-${x}-${y}`}
                            color={getStatusColor(nodeAtPos.status)}
                            backgroundColor={bgColor}
                        >
                            {getNodeSymbol(nodeAtPos)}
                        </Text>
                    );
                } else {
                    // Check if we need to render a connection here
                    let hasConnection = false;
                    let isRouteConnection = false;
                    
                    // Complex connection rendering logic would go here
                    // For simplicity, we'll just render cursor or empty space
                    
                    if (x === cursorPos.x && y === cursorPos.y) {
                        row.push(<Text key={`cursor-${x}-${y}`} color="magenta">+</Text>);
                    } else {
                        row.push(<Text key={`empty-${x}-${y}`}> </Text>);
                    }
                }
            }
            
            grid.push(
                <Box key={`row-${y}`}>
                    {row}
                </Box>
            );
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
            return <Text>No active route selected</Text>;
        }
        
        const route = network.routes[activeRouteIndex];
        return (
            <Box flexDirection="column" marginTop={1} borderStyle="single">
                <Text bold>Route: {route.name}</Text>
                <Text>Status: <Text color={route.status === 'ACTIVE' ? 'green' : 'red'}>{route.status}</Text></Text>
                <Text>Metrics:</Text>
                <Text> - Latency: <Text color="yellow">{route.metrics.totalLatency.toFixed(0)} ms</Text></Text>
                <Text> - Density: <Text color="cyan">{route.metrics.avgMilkDensity.toFixed(1)}%</Text></Text>
                <Text> - Hops: {route.metrics.hopCount}</Text>
                <Text> - Reliability: <Text color={route.metrics.reliability > 80 ? 'green' : 'red'}>
                    {route.metrics.reliability.toFixed(1)}%
                </Text></Text>
            </Box>
        );
    };

    const renderLegend = () => (
        <Box flexDirection="column" marginTop={1} borderStyle="single">
            <Text bold>Controls:</Text>
            <Text>Arrows: Move cursor</Text>
            <Text>Space: Select/place</Text>
            <Text>(v)iew, (e)dit, (a)dd, (d)elete modes</Text>
            <Text>(r)otate routes, (n)ew route, (q)uit</Text>
            <Box marginTop={1}>
                <Text bold>Node Types: </Text>
                <Text>🌿 BONG </Text>
                <Text>📏 PIPE </Text>
                <Text>💎 DAB_RIG </Text>
                <Text>🔄 ROUTER </Text>
                <Text>🎯 ENDPOINT</Text>
            </Box>
        </Box>
    );

    return (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="green">BROIP Network Visualizer v4.20</Text>
                <Text> | </Text>
                <Text>Mode: </Text>
                <Text color="yellow">{mode}</Text>
            </Box>

            {message && (
                <Box marginBottom={1} borderStyle="single" paddingX={1}>
                    <Text color="cyan">{message}</Text>
                </Box>
            )}

            <Box flexDirection="column" borderStyle="single">
                {renderGrid()}
            </Box>

            <Box flexDirection="row" marginTop={1}>
                <Box flexDirection="column" width="60%">
                    {renderRouteInfo()}
                </Box>
                <Box flexDirection="column" marginLeft={2} width="40%">
                    {renderLegend()}
                </Box>
            </Box>
        </Box>
    );
};

export default RouteVisualizer;

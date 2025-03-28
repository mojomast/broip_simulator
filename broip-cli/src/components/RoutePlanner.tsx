import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { NetworkGraph, Route, RouteNode } from '../utils/routeTypes';
import RouteVisualizer from './RouteVisualizer';

interface RoutePlannerProps {
    onReturn: () => void;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ onReturn }) => {
    const [view, setView] = useState<'MENU' | 'VISUALIZER' | 'ROUTES' | 'CREATE' | 'OPTIMIZE'>('MENU');
    const [network, setNetwork] = useState<NetworkGraph>({
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
    const [selectedStartNode, setSelectedStartNode] = useState<string | null>(null);
    const [selectedEndNode, setSelectedEndNode] = useState<string | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationProgress, setOptimizationProgress] = useState(0);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    
    // Create a default route
    useEffect(() => {
        if (network.routes.length === 0) {
            createRoute('start', 'end');
        }
    }, []);

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

    const calculateAllPossibleRoutes = (start: RouteNode, end: RouteNode, maxDepth = 10): string[][] => {
        const allRoutes: string[][] = [];
        const visited = new Set<string>();
        
        const findRoutes = (currentNode: RouteNode, path: string[], depth: number) => {
            if (depth > maxDepth) return;
            
            path.push(currentNode.id);
            
            if (currentNode.id === end.id) {
                allRoutes.push([...path]);
            } else if (depth < maxDepth) {
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

    const createRoute = (start: string, end: string) => {
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
                        } else if (node.status === 'INACTIVE') {
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
                const route: Route = {
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

    const deleteRoute = (routeId: string) => {
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

    const optimizeRoute = (routeId: string) => {
        const route = network.routes.find(r => r.id === routeId);
        if (!route) return;
        
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

    const finishOptimization = (route: Route) => {
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
                
                const optimizedRoute: Route = {
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

    const handleNodeSelect = (nodeId: string, role: 'start' | 'end') => {
        if (role === 'start') {
            setSelectedStartNode(nodeId);
        } else {
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

    const getNodeSelectItems = (role: 'start' | 'end') => {
        const items = [];
        for (const [id, node] of network.nodes.entries()) {
            // Filter out nodes that aren't sensible for the role
            if (role === 'start' && node.type === 'ENDPOINT') continue;
            if (role === 'end' && node.type === 'BONG') continue;
            
            items.push({
                label: `${getNodeIcon(node.type)} ${node.name} (${node.status})`,
                value: id
            });
        }
        return items;
    };

    const getNodeIcon = (type: string): string => {
        switch (type) {
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
            case 'PLANNING': return 'blue';
            case 'FAILED': return 'red';
            default: return 'white';
        }
    };

    const renderNodeSelection = () => (
        <Box flexDirection="column">
            <Box marginY={1}>
                <Text bold>Select Start Node:</Text>
            </Box>
            
            <SelectInput 
                items={getNodeSelectItems('start')}
                onSelect={(item) => handleNodeSelect(item.value, 'start')}
            />
            
            {selectedStartNode && (
                <>
                    <Box marginY={1}>
                        <Text bold>Select End Node:</Text>
                    </Box>
                    
                    <SelectInput 
                        items={getNodeSelectItems('end')}
                        onSelect={(item) => handleNodeSelect(item.value, 'end')}
                    />
                </>
            )}
            
            {selectedStartNode && selectedEndNode && (
                <Box marginY={1}>
                    <Box backgroundColor="green" paddingX={2} paddingY={1}>
                        <Text 
                            color="white" 
                            onPress={handleCreateRoute}
                        >
                            Create Route
                        </Text>
                    </Box>
                </Box>
            )}
            
            <Box marginY={1}>
                <Text dimColor>Press 'x' to return to menu</Text>
            </Box>
        </Box>
    );

    const renderRoutesList = () => (
        <Box flexDirection="column">
            <Text bold>BROIP Active Routes</Text>
            
            {network.routes.length === 0 ? (
                <Box marginY={1}>
                    <Text>No routes configured. Create a new route first.</Text>
                </Box>
            ) : (
                network.routes.map((route, i) => (
                    <Box 
                        key={i} 
                        marginY={1} 
                        borderStyle={selectedRoute === route.id ? "double" : "single"}
                        paddingX={1}
                        paddingY={1}
                        flexDirection="column"
                    >
                        <Box>
                            <Text bold>{route.name}</Text>
                            <Text> - </Text>
                            <Text color={getStatusColor(route.status)}>{route.status}</Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text color="yellow">{route.metrics.hopCount} hops</Text>
                            <Text> • </Text>
                            <Text color="cyan">{route.metrics.avgMilkDensity.toFixed(1)}% density</Text>
                            <Text> • </Text>
                            <Text color={route.metrics.reliability > 80 ? "green" : "red"}>
                                {route.metrics.reliability.toFixed(1)}% reliable
                            </Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>{route.nodes.map(n => network.nodes.get(n)?.name).join(' → ')}</Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Box 
                                backgroundColor="blue" 
                                color="white" 
                                paddingX={1}
                                marginRight={1}
                                onPress={() => {
                                    setSelectedRoute(route.id);
                                    setNetwork(prev => ({...prev, activeRoute: route.id}));
                                    setView('VISUALIZER');
                                }}
                            >
                                <Text color="white">Visualize</Text>
                            </Box>
                            <Box 
                                backgroundColor="yellow" 
                                paddingX={1}
                                marginRight={1}
                                onPress={() => {
                                    setSelectedRoute(route.id);
                                    setView('OPTIMIZE');
                                }}
                            >
                                <Text color="black">Optimize</Text>
                            </Box>
                            <Box 
                                backgroundColor="red" 
                                paddingX={1}
                                onPress={() => deleteRoute(route.id)}
                            >
                                <Text color="white">Delete</Text>
                            </Box>
                        </Box>
                    </Box>
                ))
            )}
            
            <Box marginY={1} flexDirection="row">
                <Box 
                    backgroundColor="green" 
                    paddingX={2}
                    paddingY={1}
                    marginRight={2}
                    onPress={() => setView('CREATE')}
                >
                    <Text color="white">Add Route</Text>
                </Box>
                
                <Box 
                    backgroundColor="gray" 
                    paddingX={2}
                    paddingY={1}
                    onPress={() => setView('MENU')}
                >
                    <Text color="white">Back</Text>
                </Box>
            </Box>
        </Box>
    );

    const renderOptimization = () => {
        const route = network.routes.find(r => r.id === selectedRoute);
        
        if (!route) {
            return (
                <Box flexDirection="column">
                    <Text>No route selected for optimization</Text>
                    <Box marginY={1}>
                        <Box 
                            backgroundColor="gray" 
                            paddingX={2}
                            paddingY={1}
                            onPress={() => setView('ROUTES')}
                        >
                            <Text color="white">Back to Routes</Text>
                        </Box>
                    </Box>
                </Box>
            );
        }
        
        return (
            <Box flexDirection="column">
                <Text bold>Route Optimization</Text>
                
                <Box marginY={1} borderStyle="single" paddingX={2} paddingY={1}>
                    <Text>Optimizing: <Text bold>{route.name}</Text></Text>
                </Box>
                
                {isOptimizing ? (
                    <Box flexDirection="column">
                        <Box marginY={1}>
                            <Text>
                                <Text color="green">
                                    <Spinner type="dots" />
                                </Text>
                                {' '}Applying Terpene Compression Algorithms...
                            </Text>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Progress: {optimizationProgress}%</Text>
                        </Box>
                        
                        <Box width={50} marginY={1}>
                            <Text>
                                {
                                    Array.from({length: 50}).map((_, i) => 
                                        i < optimizationProgress / 2 ? '█' : '░'
                                    ).join('')
                                }
                            </Text>
                        </Box>
                    </Box>
                ) : (
                    <Box flexDirection="column">
                        <Box marginY={1}>
                            <Text>Current Route Metrics:</Text>
                            <Text>- Latency: <Text color="yellow">{route.metrics.totalLatency.toFixed(0)} ms</Text></Text>
                            <Text>- Density: <Text color="cyan">{route.metrics.avgMilkDensity.toFixed(1)}%</Text></Text>
                            <Text>- Hops: {route.metrics.hopCount}</Text>
                            <Text>- Reliability: <Text color={route.metrics.reliability > 80 ? "green" : "red"}>
                                {route.metrics.reliability.toFixed(1)}%
                            </Text></Text>
                        </Box>
                        
                        <Box marginY={1}>
                            <Box 
                                backgroundColor="green" 
                                paddingX={2}
                                paddingY={1}
                                marginRight={2}
                                onPress={() => optimizeRoute(route.id)}
                            >
                                <Text color="white">Start Optimization</Text>
                            </Box>
                            
                            <Box 
                                backgroundColor="gray" 
                                paddingX={2}
                                paddingY={1}
                                onPress={() => setView('ROUTES')}
                            >
                                <Text color="white">Back</Text>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };

    useInput((input) => {
        if (input.toLowerCase() === 'x' && view !== 'MENU' && view !== 'VISUALIZER') {
            setView('MENU');
        }
    });

    if (view === 'VISUALIZER') {
        return (
            <RouteVisualizer
                network={network}
                onUpdateNetwork={setNetwork}
                onReturn={handleVisualizerReturn}
            />
        );
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

    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">BROIP Route Planner v4.20</Text>
            </Box>

            <Box marginBottom={1}>
                <Text>Plan and optimize your smoke delivery routes</Text>
            </Box>

            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text dimColor>Network Status: </Text>
                <Text color="green">OPTIMAL</Text>
                <Text dimColor> • </Text>
                <Text>{network.nodes.size} Nodes</Text>
                <Text dimColor> • </Text>
                <Text>{network.routes.length} Routes</Text>
                
                {network.routes.length > 0 && (
                    <>
                        <Text dimColor> • </Text>
                        <Text color="yellow">Avg. Latency: {
                            (network.routes.reduce((sum, route) => sum + route.metrics.totalLatency, 0) / network.routes.length).toFixed(0)
                        } ms</Text>
                    </>
                )}
            </Box>

            <SelectInput
                items={menuItems}
                onSelect={(item) => {
                    if (item.value === 'return') {
                        onReturn();
                    } else {
                        setView(item.value as 'VISUALIZER' | 'ROUTES' | 'CREATE' | 'OPTIMIZE');
                    }
                }}
            />
        </Box>
    );
};

export default RoutePlanner;

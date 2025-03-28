import React, { useState, useEffect } from 'react';
import { Box, Text } from './common';
import { useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface HARNManagerProps {
    onReturn: () => void;
}

interface RelayNode {
    id: string;
    name: string;
    type: 'GEOSTATIONARY' | 'DRONE' | 'GROUND_BACKUP';
    status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';
    location: string;
    altitude: number; // in meters (0 for ground)
    loadPercentage: number;
    reliability: number;
    backupOf?: string; // ID of primary node this serves as backup for
}

interface NodeGroup {
    id: string;
    name: string;
    primaryNodeId: string;
    backupNodeIds: string[];
    status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
    activeBackup: boolean;
    coverage: string[];
}

const HARNManager: React.FC<HARNManagerProps> = ({ onReturn }) => {
    const { preferences } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'NODES' | 'GROUPS' | 'ALERT' | 'SIMULATE'>('MENU');
    const [nodes, setNodes] = useState<RelayNode[]>([]);
    const [nodeGroups, setNodeGroups] = useState<NodeGroup[]>([]);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [alertMode, setAlertMode] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [simulationMode, setSimulationMode] = useState<'NONE' | 'SOLAR_FLARE' | 'OUTAGE' | 'INSPECTION'>('NONE');
    const [simulationProgress, setSimulationProgress] = useState(0);
    
    // Initialize nodes and groups
    useEffect(() => {
        const initialNodes: RelayNode[] = [
            {
                id: 'geo1',
                name: 'Alpha Geostationary',
                type: 'GEOSTATIONARY',
                status: 'ONLINE',
                location: 'Pacific Quadrant',
                altitude: 35786000, // geostationary orbit
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
                altitude: 0, // ground-based
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
        
        const initialGroups: NodeGroup[] = [
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
    
    const getNodeStatusColor = (status: string): string => {
        switch (status) {
            case 'ONLINE': return 'green';
            case 'DEGRADED': return 'yellow';
            case 'OFFLINE': return 'red';
            case 'MAINTENANCE': return 'blue';
            default: return 'white';
        }
    };
    
    const getGroupStatusColor = (status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL'): string => {
        switch (status) {
            case 'OPTIMAL': return 'green';
            case 'DEGRADED': return 'yellow';
            case 'CRITICAL': return 'red';
            default: return 'white';
        }
    };
    
    const formatAltitude = (meters: number): string => {
        if (meters === 0) return 'Ground';
        if (meters >= 1000000) return `${(meters / 1000000).toFixed(1)}M km`;
        if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
        return `${meters} m`;
    };
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else {
            setActiveScreen(item.value as 'NODES' | 'GROUPS' | 'SIMULATE');
        }
    };
    
    const toggleNodeBackup = (nodeId: string) => {
        // Find which group this node belongs to
        const group = nodeGroups.find(g => 
            g.primaryNodeId === nodeId || g.backupNodeIds.includes(nodeId)
        );
        
        if (!group) return;
        
        // Toggle backup state
        const updatedGroups = nodeGroups.map(g => {
            if (g.id === group.id) {
                return {
                    ...g,
                    activeBackup: !g.activeBackup,
                    status: !g.activeBackup ? 'OPTIMAL' : 'DEGRADED' as 'OPTIMAL' | 'DEGRADED' | 'CRITICAL'
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
    
    const runSimulation = (type: 'SOLAR_FLARE' | 'OUTAGE' | 'INSPECTION') => {
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
    
    const finishSimulation = (type: 'SOLAR_FLARE' | 'OUTAGE' | 'INSPECTION') => {
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
                            status: 'DEGRADED' as 'OPTIMAL' | 'DEGRADED' | 'CRITICAL',
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
                            status: 'DEGRADED' as 'OPTIMAL' | 'DEGRADED' | 'CRITICAL',
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
                        status: 'DEGRADED' as 'OPTIMAL' | 'DEGRADED' | 'CRITICAL',
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
            status: group.name === 'Europe Drone Group' ? 'DEGRADED' as 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' : 'OPTIMAL',
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
    const renderMenuScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">HARN Manager & Redundancy System</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Manage High-Altitude Relay Nodes with failover capabilities</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text>Active Nodes: <Text bold color="green">
                    {nodes.filter(n => n.status === 'ONLINE').length}/{nodes.length}
                </Text></Text>
                <Text>Node Groups: <Text bold color="cyan">
                    {nodeGroups.length}
                </Text></Text>
                <Text>Network Status: <Text bold color={
                    nodeGroups.some(g => g.status === 'CRITICAL') ? 'red' :
                    nodeGroups.some(g => g.status === 'DEGRADED') ? 'yellow' : 'green'
                }>
                    {nodeGroups.some(g => g.status === 'CRITICAL') ? 'CRITICAL' :
                    nodeGroups.some(g => g.status === 'DEGRADED') ? 'DEGRADED' : 'OPTIMAL'}
                </Text></Text>
                <Text>Backup Systems: <Text bold color="yellow">
                    {nodeGroups.filter(g => g.activeBackup).length > 0 ? 'ENGAGED' : 'STANDBY'}
                </Text></Text>
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );
    
    // Render the nodes view
    const renderNodesScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">HARN Network Nodes</Text>
            </Box>
            
            <Box flexDirection="column">
                {nodes.map(node => (
                    <Box 
                        key={node.id} 
                        flexDirection="column"
                        borderStyle={selectedNode === node.id ? "double" : "single"}
                        paddingX={2}
                        paddingY={1}
                        marginBottom={1}
                        onPress={() => setSelectedNode(node.id)}
                    >
                        <Box>
                            <Text bold>{node.name}</Text>
                            <Text> - </Text>
                            <Text color={getNodeStatusColor(node.status)}>{node.status}</Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>Type: {node.type}</Text>
                            <Text> • </Text>
                            <Text>Location: {node.location}</Text>
                        </Box>
                        
                        {selectedNode === node.id && (
                            <>
                                <Box marginTop={1} flexDirection="column">
                                    <Text>Altitude: {formatAltitude(node.altitude)}</Text>
                                    <Text>Load: <Text color={
                                        node.loadPercentage > 80 ? 'red' :
                                        node.loadPercentage > 60 ? 'yellow' : 'green'
                                    }>{node.loadPercentage}%</Text></Text>
                                    <Text>Reliability: <Text color={
                                        node.reliability > 98 ? 'green' :
                                        node.reliability > 90 ? 'yellow' : 'red'
                                    }>{node.reliability.toFixed(1)}%</Text></Text>
                                    {node.backupOf && (
                                        <Text>Backup for: {nodes.find(n => n.id === node.backupOf)?.name}</Text>
                                    )}
                                </Box>
                                
                                {node.type === 'GROUND_BACKUP' && (
                                    <Box marginTop={1}>
                                        <Box 
                                            backgroundColor="blue" 
                                            paddingX={2} 
                                            paddingY={1}
                                            onPress={() => toggleNodeBackup(node.id)}
                                        >
                                            <Text color="white">Toggle Backup Status</Text>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                ))}
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Render the groups view
    const renderGroupsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">HARN Node Groups</Text>
            </Box>
            
            <Box flexDirection="column">
                {nodeGroups.map(group => {
                    const primaryNode = nodes.find(n => n.id === group.primaryNodeId);
                    const backupNodes = nodes.filter(n => group.backupNodeIds.includes(n.id));
                    
                    return (
                        <Box 
                            key={group.id} 
                            flexDirection="column"
                            borderStyle={selectedGroup === group.id ? "double" : "single"}
                            paddingX={2}
                            paddingY={1}
                            marginBottom={1}
                            onPress={() => setSelectedGroup(group.id)}
                        >
                            <Box>
                                <Text bold>{group.name}</Text>
                                <Text> - </Text>
                                <Text color={getGroupStatusColor(group.status)}>{group.status}</Text>
                            </Box>
                            
                            <Box marginTop={1}>
                                <Text>Primary: <Text bold>{primaryNode?.name}</Text></Text>
                                <Text> • </Text>
                                <Text>Backup: {group.activeBackup ? 
                                    <Text color="green">ACTIVE</Text> : 
                                    <Text color="yellow">STANDBY</Text>}
                                </Text>
                            </Box>
                            
                            {selectedGroup === group.id && (
                                <>
                                    <Box marginTop={1} flexDirection="column">
                                        <Text>Coverage Areas:</Text>
                                        {group.coverage.map((area, index) => (
                                            <Text key={index}>- {area}</Text>
                                        ))}
                                    </Box>
                                    
                                    <Box marginTop={1}>
                                        <Text>Backup Nodes:</Text>
                                        {backupNodes.length > 0 ? (
                                            backupNodes.map((node, index) => (
                                                <Text key={index}>- {node.name} ({getNodeStatusColor(node.status)})</Text>
                                            ))
                                        ) : (
                                            <Text color="red">No backup nodes assigned!</Text>
                                        )}
                                    </Box>
                                    
                                    {backupNodes.length > 0 && (
                                        <Box marginTop={1}>
                                            <Box 
                                                backgroundColor={group.activeBackup ? "red" : "green"} 
                                                paddingX={2} 
                                                paddingY={1}
                                                onPress={() => toggleNodeBackup(group.primaryNodeId)}
                                            >
                                                <Text color="white">
                                                    {group.activeBackup ? "Deactivate Backup" : "Activate Backup"}
                                                </Text>
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    );
                })}
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Render the simulation screen
    const renderSimulationScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">HARN Outage Simulation</Text>
            </Box>
            
            {isProcessing ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="yellow">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Simulating {simulationMode.replace('_', ' ')}...
                    </Text>
                    <Text>Progress: {simulationProgress}%</Text>
                    <Box width={50} marginY={1}>
                        <Text>
                            {Array.from({length: 50}).map((_, i) => 
                                i < simulationProgress / 2 ? '█' : '░'
                            ).join('')}
                        </Text>
                    </Box>
                    
                    {simulationMode === 'SOLAR_FLARE' && (
                        <Text>Solar radiation increasing... geostationary nodes affected...</Text>
                    )}
                    
                    {simulationMode === 'OUTAGE' && (
                        <Text>Node connection dropping... initiating failover protocol...</Text>
                    )}
                    
                    {simulationMode === 'INSPECTION' && (
                        <Text>Government inspection detected... activating stealth protocols...</Text>
                    )}
                </Box>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Text>Select a scenario to test backup systems:</Text>
                    </Box>
                    
                    <Box flexDirection="column">
                        {simulationItems.map(item => (
                            <Box 
                                key={item.value}
                                flexDirection="column"
                                borderStyle="single"
                                paddingX={2}
                                paddingY={1}
                                marginBottom={1}
                            >
                                <Text bold>{item.label}</Text>
                                
                                <Box marginTop={1}>
                                    {item.value === 'SOLAR_FLARE' && (
                                        <Text>Simulates radiation disruption to geostationary nodes</Text>
                                    )}
                                    
                                    {item.value === 'OUTAGE' && (
                                        <Text>Simulates sudden failure of a random relay node</Text>
                                    )}
                                    
                                    {item.value === 'INSPECTION' && (
                                        <Text>Simulates government monitoring with stealth mode activation</Text>
                                    )}
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Box 
                                        backgroundColor="yellow" 
                                        paddingX={2} 
                                        paddingY={1}
                                        onPress={() => runSimulation(item.value as any)}
                                    >
                                        <Text color="black">Run Simulation</Text>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Render the alert screen
    const renderAlertScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="red">⚠️ HARN ALERT</Text>
            </Box>
            
            <Box 
                flexDirection="column"
                borderStyle="double"
                borderColor="red"
                paddingX={2}
                paddingY={1}
                marginY={2}
            >
                <Text bold color="yellow">{alertMessage}</Text>
            </Box>
            
            <Box marginY={1}>
                <Text>The system is automatically responding to this event.</Text>
                <Text>Backup systems are being engaged according to protocol.</Text>
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => {
                        setActiveScreen('NODES');
                        setAlertMode(false);
                    }}>View Nodes</Text>
                </Box>
            </Box>
        </Box>
    );
    
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

export default HARNManager;

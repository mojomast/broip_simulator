import React, { useState, useEffect } from 'react';
import { Box, Text } from './common';
import { useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface PeerToPeerSharingProps {
    onReturn: () => void;
}

interface Peer {
    id: string;
    username: string;
    status: 'ONLINE' | 'BUSY' | 'OFFLINE' | 'DABBING';
    latency: number;
    trust: number; // 0-100
    lastActive: string;
    encryption: 'STANDARD' | 'END_TO_END' | 'QUANTUM';
}

interface Session {
    id: string;
    name: string;
    peerId: string;
    peerName: string;
    startTime: Date;
    status: 'CONNECTING' | 'ACTIVE' | 'DEGRADED' | 'CLOSED';
    directConnection: boolean;
    metrics: {
        latency: number;
        bandwidth: number;
        privacy: number; // 0-100
    };
}

const PeerToPeerSharing: React.FC<PeerToPeerSharingProps> = ({ onReturn }) => {
    const { profile } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'CREATE' | 'JOIN' | 'MANAGE' | 'PRIVACY'>('MENU');
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeSessions, setActiveSessions] = useState<Session[]>([]);
    const [availablePeers, setAvailablePeers] = useState<Peer[]>([]);
    const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [encryptionLevel, setEncryptionLevel] = useState<'STANDARD' | 'END_TO_END' | 'QUANTUM'>('STANDARD');
    const [sessionCreationStep, setSessionCreationStep] = useState<1 | 2 | 3>(1);
    const [sessionName, setSessionName] = useState('Private Session');
    
    // Initialize with some peers on first load
    useEffect(() => {
        const initialPeers: Peer[] = [
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
    
    const createSession = (peerId: string) => {
        const peer = availablePeers.find(p => p.id === peerId);
        if (!peer) return;
        
        setIsProcessing(true);
        
        // Simulate session setup
        setTimeout(() => {
            const newSession: Session = {
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
                setActiveSessions(prev => prev.map(session => 
                    session.id === newSession.id 
                        ? { ...session, status: 'ACTIVE' } 
                        : session
                ));
                setIsProcessing(false);
                setActiveScreen('MANAGE');
            }, 1500);
        }, 2000);
    };
    
    const terminateSession = (sessionId: string) => {
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
        if (selectedSession === sessionId) {
            setSelectedSession(null);
        }
    };
    
    const getStatusColor = (status: string): string => {
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
    
    const formatDuration = (startTime: Date): string => {
        const diffMs = new Date().getTime() - startTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        
        if (diffMins > 0) {
            return `${diffMins}m ${diffSecs}s`;
        }
        return `${diffSecs}s`;
    };
    
    const getPrivacyRating = (privacy: number): string => {
        if (privacy >= 95) return "Maximum Privacy";
        if (privacy >= 85) return "Very High Privacy";
        if (privacy >= 70) return "Good Privacy";
        return "Basic Privacy";
    };
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else {
            setActiveScreen(item.value as 'CREATE' | 'JOIN' | 'MANAGE' | 'PRIVACY');
        }
    };
    
    const handlePeerSelect = (peerId: string) => {
        setSelectedPeer(peerId);
        setSessionCreationStep(2);
    };
    
    const handleEncryptionSelect = (encryption: string) => {
        setEncryptionLevel(encryption as 'STANDARD' | 'END_TO_END' | 'QUANTUM');
        setSessionCreationStep(3);
    };
    
    // Main menu screen
    const renderMenuScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Peer-to-Peer Rip Sharing</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Direct RI-to-RR connections for private sessions</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text>Active P2P Sessions: <Text bold color="cyan">{activeSessions.length}</Text></Text>
                <Text>Online Peers: <Text bold color="green">{availablePeers.filter(p => p.status !== 'OFFLINE').length}</Text></Text>
                <Text>Encryption: <Text bold>{encryptionLevel}</Text></Text>
                <Text>Avg Latency: <Text bold color="yellow">
                    {activeSessions.length > 0 
                        ? Math.floor(activeSessions.reduce((sum, session) => sum + session.metrics.latency, 0) / activeSessions.length)
                        : '--'} ms
                </Text></Text>
            </Box>
            
            <SelectInput items={menuItems} onSelect={(item) => handleMenuSelect(item)} />
        </Box>
    );
    
    // Create session screen
    const renderCreateScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Create P2P Session</Text>
                <Text> - Step {sessionCreationStep}/3</Text>
            </Box>
            
            {isProcessing ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Establishing direct connection...
                    </Text>
                    <Text>Setting up {encryptionLevel} encryption...</Text>
                    <Text>Negotiating connection parameters...</Text>
                </Box>
            ) : sessionCreationStep === 1 ? (
                <>
                    <Box marginBottom={1}>
                        <Text>Select a peer to connect with:</Text>
                    </Box>
                    
                    <Box flexDirection="column">
                        {availablePeers
                            .filter(peer => peer.status !== 'OFFLINE')
                            .map(peer => (
                                <Box 
                                    key={peer.id}
                                    flexDirection="column"
                                    borderStyle="single"
                                    paddingX={2}
                                    paddingY={1}
                                    marginBottom={1}
                                >
                                    <Box>
                                        <Text bold>{peer.username}</Text>
                                        <Text> - </Text>
                                        <Text color={getStatusColor(peer.status)}>{peer.status}</Text>
                                    </Box>
                                    
                                    <Box marginTop={1}>
                                        <Text>Latency: <Text color={peer.latency < 50 ? "green" : "yellow"}>{peer.latency} ms</Text></Text>
                                        <Text> • </Text>
                                        <Text>Trust: <Text color={peer.trust > 90 ? "green" : "yellow"}>{peer.trust}%</Text></Text>
                                        <Text> • </Text>
                                        <Text>Last Active: {peer.lastActive}</Text>
                                    </Box>
                                    
                                    <Box marginTop={1}>
                                        <Box 
                                            backgroundColor="blue" 
                                            paddingX={2} 
                                            paddingY={1}
                                            onPress={() => handlePeerSelect(peer.id)}
                                        >
                                            <Text color="white">Select</Text>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                    </Box>
                </>
            ) : sessionCreationStep === 2 ? (
                <>
                    <Box marginBottom={1}>
                        <Text>Select encryption level:</Text>
                    </Box>
                    
                    <Box flexDirection="column">
                        {encryptionItems.map(item => (
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
                                    {item.value === 'STANDARD' && (
                                        <Text>Basic encryption with optimal performance.</Text>
                                    )}
                                    {item.value === 'END_TO_END' && (
                                        <Text>No middleman access, better privacy but slight latency impact.</Text>
                                    )}
                                    {item.value === 'QUANTUM' && (
                                        <Text>Experimental ultra-secure encryption. Higher latency.</Text>
                                    )}
                                </Box>
                                <Box marginTop={1}>
                                    <Box 
                                        backgroundColor="blue" 
                                        paddingX={2} 
                                        paddingY={1}
                                        onPress={() => handleEncryptionSelect(item.value)}
                                    >
                                        <Text color="white">Select</Text>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Text>Confirm session details:</Text>
                    </Box>
                    
                    <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                        <Text>Peer: <Text bold>{availablePeers.find(p => p.id === selectedPeer)?.username}</Text></Text>
                        <Text>Encryption: <Text bold>{encryptionLevel}</Text></Text>
                        <Text>Session Name: <Text bold>{sessionName}</Text></Text>
                        <Text>Estimated Latency: <Text bold color="yellow">
                            {(availablePeers.find(p => p.id === selectedPeer)?.latency || 0) + 
                             (encryptionLevel === 'STANDARD' ? 0 : encryptionLevel === 'END_TO_END' ? 10 : 20)} ms
                        </Text></Text>
                    </Box>
                    
                    <Box marginTop={1}>
                        <Box 
                            backgroundColor="green" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={() => selectedPeer && createSession(selectedPeer)}
                        >
                            <Text color="white">Create Session</Text>
                        </Box>
                        
                        <Box 
                            backgroundColor="red" 
                            paddingX={2} 
                            paddingY={1}
                            onPress={() => {
                                setSessionCreationStep(1);
                                setSelectedPeer(null);
                            }}
                        >
                            <Text color="white">Cancel</Text>
                        </Box>
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
    
    // Join session screen
    const renderJoinScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Join Session Room</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Available session rooms:</Text>
            </Box>
            
            <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                <Text color="yellow">Community Session Rooms Coming Soon!</Text>
                <Text>This feature will be available in the next update.</Text>
                <Text>For now, use 'Create Direct Session' to establish P2P connections.</Text>
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Manage sessions screen
    const renderManageScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Manage P2P Sessions</Text>
            </Box>
            
            {activeSessions.length === 0 ? (
                <Box marginY={2}>
                    <Text>No active P2P sessions. Create a new one!</Text>
                    <Box marginTop={1}>
                        <Box 
                            backgroundColor="green" 
                            paddingX={2} 
                            paddingY={1}
                            onPress={() => setActiveScreen('CREATE')}
                        >
                            <Text color="white">Create Session</Text>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box flexDirection="column">
                    {activeSessions.map(session => (
                        <Box 
                            key={session.id} 
                            flexDirection="column"
                            borderStyle={selectedSession === session.id ? "double" : "single"}
                            paddingX={2}
                            paddingY={1}
                            marginBottom={1}
                            onPress={() => setSelectedSession(session.id)}
                        >
                            <Box>
                                <Text bold>{session.name}</Text>
                                <Text> - </Text>
                                <Text color={getStatusColor(session.status)}>{session.status}</Text>
                            </Box>
                            
                            <Box marginTop={1}>
                                <Text>Connected to: <Text bold>{session.peerName}</Text></Text>
                                <Text> • </Text>
                                <Text>Duration: {formatDuration(session.startTime)}</Text>
                            </Box>
                            
                            {selectedSession === session.id && (
                                <>
                                    <Box marginTop={1} flexDirection="column">
                                        <Text>Connection Type: {session.directConnection ? "Direct P2P" : "HARN-Routed"}</Text>
                                        <Text>Latency: <Text color={session.metrics.latency < 50 ? "green" : "yellow"}>{session.metrics.latency} ms</Text></Text>
                                        <Text>Bandwidth: {session.metrics.bandwidth} Kbps</Text>
                                        <Text>Privacy Rating: <Text color={session.metrics.privacy > 80 ? "green" : "yellow"}>
                                            {getPrivacyRating(session.metrics.privacy)} ({session.metrics.privacy}/100)
                                        </Text></Text>
                                    </Box>
                                    
                                    <Box marginTop={1}>
                                        <Box 
                                            backgroundColor="red" 
                                            paddingX={2} 
                                            paddingY={1}
                                            onPress={() => terminateSession(session.id)}
                                        >
                                            <Text color="white">End Session</Text>
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Box>
                    ))}
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Privacy settings screen
    const renderPrivacyScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">P2P Privacy Settings</Text>
            </Box>
            
            <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                <Text bold>Current Encryption: <Text color={
                    encryptionLevel === 'QUANTUM' ? 'magenta' : 
                    encryptionLevel === 'END_TO_END' ? 'green' : 'yellow'
                }>{encryptionLevel}</Text></Text>
                
                <Box marginY={1}>
                    <Text>Default encryption level for new P2P sessions</Text>
                </Box>
                
                <Box marginTop={1}>
                    {encryptionItems.map(item => (
                        <Box 
                            key={item.value}
                            marginBottom={1}
                        >
                            <Box 
                                backgroundColor={encryptionLevel === item.value ? "green" : "blue"} 
                                paddingX={2} 
                                paddingY={1}
                                onPress={() => setEncryptionLevel(item.value as any)}
                            >
                                <Text color="white">{item.label}</Text>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            
            <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                <Text bold>Additional Settings</Text>
                
                <Box marginY={1} flexDirection="column">
                    <Box marginBottom={1}>
                        <Box 
                            backgroundColor="blue" 
                            paddingX={2} 
                            paddingY={1}
                        >
                            <Text color="white">Auto-Accept Friend Requests: ON</Text>
                        </Box>
                    </Box>
                    
                    <Box marginBottom={1}>
                        <Box 
                            backgroundColor="blue" 
                            paddingX={2} 
                            paddingY={1}
                        >
                            <Text color="white">Show Online Status: ON</Text>
                        </Box>
                    </Box>
                    
                    <Box>
                        <Box 
                            backgroundColor="blue" 
                            paddingX={2} 
                            paddingY={1}
                        >
                            <Text color="white">Anonymous Usage Stats: OFF</Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
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

export default PeerToPeerSharing;

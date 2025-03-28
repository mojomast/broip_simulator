import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface RipQualityServiceProps {
    onReturn: () => void;
}

interface ServiceTier {
    id: string;
    name: string;
    description: string;
    color: string;
    latency: number;
    fidelity: number;
    reliability: number;
    price: number;
}

interface ActiveSession {
    id: string;
    destination: string;
    tier: ServiceTier;
    startTime: Date;
    status: 'CONNECTING' | 'ACTIVE' | 'DEGRADED' | 'CLOSED';
    metrics: {
        packetLoss: number;
        jitter: number;
        bandwidth: number;
    };
}

const RipQualityService: React.FC<RipQualityServiceProps> = ({ onReturn }) => {
    const { profile, updateProfile } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'MANAGE' | 'UPGRADE' | 'STATS'>('MENU');
    const [selectedTier, setSelectedTier] = useState<ServiceTier>(serviceTiers[0]);
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Generate a random session on first load
    useEffect(() => {
        if (activeSessions.length === 0) {
            createRandomSession();
        }
    }, [activeSessions]);

    const serviceTiers: ServiceTier[] = [
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
        
        const newSession: ActiveSession = {
            id: Math.random().toString(36).substr(2, 9),
            destination: randomDestination,
            tier: randomTier,
            startTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)), // Started within last hour
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

    const upgradeTier = (tierId: string) => {
        const tier = serviceTiers.find(t => t.id === tierId);
        if (!tier) return;
        
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
                setActiveSessions(prev => prev.map(session => 
                    session.id === selectedSession 
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
                        : session
                ));
                
                // Simulate connection stabilizing
                setTimeout(() => {
                    setActiveSessions(prev => prev.map(session => 
                        session.id === selectedSession 
                            ? { ...session, status: 'ACTIVE' } 
                            : session
                    ));
                }, 1500);
            }
            
            setIsProcessing(false);
            setActiveScreen('MANAGE');
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
            case 'ACTIVE': return 'green';
            case 'CONNECTING': return 'yellow';
            case 'DEGRADED': return 'red';
            case 'CLOSED': return 'gray';
            default: return 'white';
        }
    };

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDuration = (startTime: Date): string => {
        const diffMs = new Date().getTime() - startTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const remainingMins = diffMins % 60;
        
        if (diffHours > 0) {
            return `${diffHours}h ${remainingMins}m`;
        }
        return `${diffMins}m`;
    };

    const handleSessionSelect = (sessionId: string) => {
        setSelectedSession(sessionId);
    };

    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else {
            setActiveScreen(item.value as 'MANAGE' | 'UPGRADE' | 'STATS');
        }
    };

    const ActiveSessionItem = ({ session }: { session: ActiveSession }) => (
        <Box 
            key={session.id} 
            flexDirection="column"
            borderStyle={selectedSession === session.id ? "double" : "single"}
            paddingX={2}
            paddingY={1}
            marginBottom={1}
            onPress={() => handleSessionSelect(session.id)}
        >
            <Box>
                <Text bold>Destination: {session.destination}</Text>
                <Text> - </Text>
                <Text color={getStatusColor(session.status)}>{session.status}</Text>
            </Box>
            
            <Box marginTop={1}>
                <Text>Tier: <Text color={session.tier.color}>{session.tier.name}</Text></Text>
                <Text> • </Text>
                <Text>Started: {formatTime(session.startTime)} ({formatDuration(session.startTime)})</Text>
            </Box>
            
            {selectedSession === session.id && (
                <>
                    <Box marginTop={1} flexDirection="column">
                        <Text>Packet Loss: {session.metrics.packetLoss.toFixed(1)}%</Text>
                        <Text>Jitter: {session.metrics.jitter.toFixed(1)} ms</Text>
                        <Text>Bandwidth: {session.metrics.bandwidth} Kbps</Text>
                    </Box>
                    
                    <Box marginTop={1}>
                        <Box 
                            backgroundColor="yellow" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={() => setActiveScreen('UPGRADE')}
                        >
                            <Text color="black">Upgrade Tier</Text>
                        </Box>
                        
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
    );

    const SessionStats = ({ session }: { session: ActiveSession }) => (
        <Box flexDirection="column">
            <Text>Packet Loss: {session.metrics.packetLoss.toFixed(1)}%</Text>
            <Text>Jitter: {session.metrics.jitter.toFixed(1)} ms</Text>
            <Text>Bandwidth: {session.metrics.bandwidth} Kbps</Text>
        </Box>
    );

    const ManageSessions = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Manage RQoS Sessions</Text>
            </Box>
            
            {activeSessions.length === 0 ? (
                <Box marginY={2}>
                    <Text>No active sessions. Create a new one!</Text>
                    <Box marginTop={1}>
                        <Box 
                            backgroundColor="green" 
                            paddingX={2} 
                            paddingY={1}
                            onPress={() => {
                                const newSession = createRandomSession();
                                setSelectedSession(newSession.id);
                            }}
                        >
                            <Text color="white">Create Session</Text>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box flexDirection="column">
                    {activeSessions.map(session => (
                        <ActiveSessionItem key={session.id} session={session} />
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

    const UpgradeTier = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Upgrade RQoS Tier</Text>
            </Box>
            
            {isProcessing ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Upgrading service tier...
                    </Text>
                    <Text>Adjusting RQoS parameters...</Text>
                    <Text>Rebalancing terpene bandwidth allocation...</Text>
                </Box>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Text>Available DabCoins: <Text color="yellow">{profile.dabCoins.toFixed(2)}</Text></Text>
                    </Box>
                    
                    <Box flexDirection="column">
                        {serviceTiers.map(tier => (
                            <Box 
                                key={tier.id} 
                                flexDirection="column"
                                borderStyle={selectedTier.id === tier.id ? "double" : "single"}
                                paddingX={2}
                                paddingY={1}
                                marginBottom={1}
                            >
                                <Box>
                                    <Text color={tier.color} bold>{tier.name}</Text>
                                    <Text> - </Text>
                                    <Text>{tier.price > 0 ? `${tier.price} DabCoins` : 'Free'}</Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text>{tier.description}</Text>
                                </Box>
                                
                                <Box marginTop={1} flexDirection="column">
                                    <Text>Latency: {tier.latency}ms</Text>
                                    <Text>Terpene Fidelity: {tier.fidelity.toFixed(1)}%</Text>
                                    <Text>Reliability: {tier.reliability.toFixed(1)}%</Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    {selectedTier.id !== tier.id ? (
                                        <Box 
                                            backgroundColor="green" 
                                            paddingX={2} 
                                            paddingY={1}
                                            onPress={() => upgradeTier(tier.id)}
                                        >
                                            <Text color="white">Select Tier</Text>
                                        </Box>
                                    ) : (
                                        <Text color="green">✓ Current Tier</Text>
                                    )}
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

    const PerformanceStats = () => {
        // Calculate aggregate statistics
        const totalSessions = activeSessions.length;
        const averageLatency = selectedTier.latency;
        const uptimePercentage = 99.7;
        const packetLossAvg = activeSessions.reduce((sum, session) => sum + session.metrics.packetLoss, 0) / Math.max(1, totalSessions);
        
        return (
            <Box flexDirection="column" padding={1}>
                <Box marginBottom={1}>
                    <Text bold color="green">RQoS Performance Metrics</Text>
                </Box>
                
                <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                    <Text bold>Service Uptime</Text>
                    <Box marginY={1}>
                        <Text>Uptime: <Text color="green">{uptimePercentage.toFixed(1)}%</Text></Text>
                        <Text> • </Text>
                        <Text>Active Sessions: {totalSessions}</Text>
                    </Box>
                    
                    <Box width={50} marginY={1}>
                        <Text>
                            {Array.from({length: 50}).map((_, i) => 
                                i < (uptimePercentage / 2) ? '█' : '░'
                            ).join('')}
                        </Text>
                    </Box>
                </Box>
                
                <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                    <Text bold>Quality Metrics</Text>
                    <Box marginY={1} flexDirection="column">
                        <Text>Avg. Latency: <Text color={averageLatency < 30 ? "green" : "yellow"}>{averageLatency}ms</Text></Text>
                        <Text>Avg. Packet Loss: <Text color={packetLossAvg < 2 ? "green" : "yellow"}>{packetLossAvg.toFixed(1)}%</Text></Text>
                        <Text>Terpene Fidelity: <Text color="green">{selectedTier.fidelity.toFixed(1)}%</Text></Text>
                    </Box>
                </Box>
                
                <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1}>
                    <Text bold>Recommendation</Text>
                    <Box marginY={1}>
                        {selectedTier.id === 'dabstorm' ? (
                            <Text color="green">You're already on our top tier service! Enjoy maximum rip quality.</Text>
                        ) : (
                            <Text>Upgrade to {serviceTiers.find(t => t.id !== selectedTier.id)?.name} for {selectedTier.id === 'casual' ? '13ms lower latency' : '15ms lower latency and 99.9% reliability'}</Text>
                        )}
                    </Box>
                </Box>
                
                <Box marginTop={2}>
                    <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                        <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                    </Box>
                </Box>
            </Box>
        );
    };

    const MainMenu = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Dynamic RQoS Service Manager</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Prioritize your rips with tiered service levels</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Box>
                    <Text>Active Tier: </Text>
                    <Text color={selectedTier.color} bold>{selectedTier.name}</Text>
                </Box>
                <Text>Active Sessions: {activeSessions.length}</Text>
                <Text>DabCoins Available: <Text color="yellow">{profile.dabCoins.toFixed(2)}</Text></Text>
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );

    return (
        <Box flexDirection="column">
            {activeScreen === 'MENU' && <MainMenu />}
            {activeScreen === 'MANAGE' && <ManageSessions />}
            {activeScreen === 'UPGRADE' && <UpgradeTier />}
            {activeScreen === 'STATS' && <PerformanceStats />}
        </Box>
    );
};

export default RipQualityService;

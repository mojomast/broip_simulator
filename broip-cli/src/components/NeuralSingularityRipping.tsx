import React, { useState, useEffect } from 'react';
import { Box, Text } from './common';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface NeuralSingularityRippingProps {
    onReturn: () => void;
}

interface BrainwavePattern {
    id: string;
    name: string;
    description: string;
    intensity: number;
    frequency: number;
    synchronicity: number;
    effects: string[];
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
}

interface NeuralConnection {
    id: string;
    status: 'DISCONNECTED' | 'CALIBRATING' | 'CONNECTED' | 'SYNCED' | 'TRANSCENDING';
    signalStrength: number;
    latency: number;
    syncLevel: number;
    activePattern?: string;
}

const NeuralSingularityRipping: React.FC<NeuralSingularityRippingProps> = ({ onReturn }) => {
    const { preferences } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'CALIBRATE' | 'PATTERNS' | 'ACTIVE_SESSION' | 'SETTINGS'>('MENU');
    const [neuralConnection, setNeuralConnection] = useState<NeuralConnection>({
        id: 'neural-link-1',
        status: 'DISCONNECTED',
        signalStrength: 0,
        latency: 0,
        syncLevel: 0
    });
    const [brainwavePatterns, setBrainwavePatterns] = useState<BrainwavePattern[]>([]);
    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibrationProgress, setCalibrationProgress] = useState(0);
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionIntensity, setSessionIntensity] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [egoLevel, setEgoLevel] = useState(100);
    const [thoughtStream, setThoughtStream] = useState<string[]>([]);
    const [safetyProtocols, setSafetyProtocols] = useState({
        egoProtection: true,
        realityAnchor: true,
        autoTerminate: true,
        intensityLimit: 70
    });
    
    // Initialize brainwave patterns
    useEffect(() => {
        const initialPatterns: BrainwavePattern[] = [
            {
                id: 'alpha-wave',
                name: 'Alpha Relaxation',
                description: 'Gentle relaxation with mild euphoria and creativity enhancement',
                intensity: 30,
                frequency: 8.5,
                synchronicity: 65,
                effects: ['Relaxation', 'Mild Euphoria', 'Creativity', 'Stress Reduction'],
                riskLevel: 'LOW'
            },
            {
                id: 'theta-deep',
                name: 'Theta Dreamscape',
                description: 'Deep meditative state with vivid imagery and enhanced sensory perception',
                intensity: 50,
                frequency: 6.0,
                synchronicity: 75,
                effects: ['Vivid Imagery', 'Time Distortion', 'Sensory Enhancement', 'Introspection'],
                riskLevel: 'MODERATE'
            },
            {
                id: 'gamma-burst',
                name: 'Gamma Insight',
                description: 'Heightened awareness and cognitive enhancement with profound insights',
                intensity: 70,
                frequency: 40.0,
                synchronicity: 85,
                effects: ['Cognitive Enhancement', 'Pattern Recognition', 'Insight Generation', 'Information Processing'],
                riskLevel: 'HIGH'
            },
            {
                id: 'delta-void',
                name: 'Delta Void',
                description: 'Profound disconnection from physical reality with ego dissolution',
                intensity: 90,
                frequency: 2.0,
                synchronicity: 95,
                effects: ['Ego Dissolution', 'Reality Detachment', 'Cosmic Consciousness', 'Transcendence'],
                riskLevel: 'EXTREME'
            },
            {
                id: 'quantum-entangle',
                name: 'Quantum Entanglement',
                description: 'Experimental pattern that synchronizes consciousness across multiple dimensions',
                intensity: 100,
                frequency: 108.0,
                synchronicity: 99,
                effects: ['Multidimensional Awareness', 'Time Perception Collapse', 'Universal Connectivity', 'Existence Beyond Form'],
                riskLevel: 'EXTREME'
            }
        ];
        
        setBrainwavePatterns(initialPatterns);
    }, []);
    
    const menuItems = [
        {
            label: '🧠 Calibrate Neural Interface',
            value: 'calibrate'
        },
        {
            label: '🌊 Brainwave Pattern Library',
            value: 'patterns'
        },
        {
            label: '🚀 Begin Neural Rip Session',
            value: 'session'
        },
        {
            label: '⚙️ Safety Protocols & Settings',
            value: 'settings'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else if (item.value === 'calibrate') {
            setActiveScreen('CALIBRATE');
        } else if (item.value === 'patterns') {
            setActiveScreen('PATTERNS');
        } else if (item.value === 'session') {
            if (neuralConnection.status === 'SYNCED' || neuralConnection.status === 'TRANSCENDING') {
                setActiveScreen('ACTIVE_SESSION');
            } else {
                // Cannot start session without calibration
                setActiveScreen('CALIBRATE');
            }
        } else if (item.value === 'settings') {
            setActiveScreen('SETTINGS');
        }
    };
    
    const calibrateNeuralInterface = () => {
        setIsCalibrating(true);
        setCalibrationProgress(0);
        
        // Simulate calibration process
        const interval = setInterval(() => {
            setCalibrationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishCalibration();
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
    };
    
    const finishCalibration = () => {
        // Update neural connection status
        setNeuralConnection({
            ...neuralConnection,
            status: 'SYNCED',
            signalStrength: Math.floor(Math.random() * 20) + 80, // 80-100%
            latency: Math.floor(Math.random() * 10) + 1, // 1-10ms
            syncLevel: Math.floor(Math.random() * 15) + 85 // 85-100%
        });
        
        setIsCalibrating(false);
    };
    
    const selectBrainwavePattern = (patternId: string) => {
        setSelectedPattern(patternId);
        
        // Update neural connection with selected pattern
        setNeuralConnection(prev => ({
            ...prev,
            activePattern: patternId,
            status: patternId === 'quantum-entangle' || patternId === 'delta-void' ? 'TRANSCENDING' : 'SYNCED'
        }));
    };
    
    const startNeuralSession = () => {
        if (!selectedPattern) return;
        
        const pattern = brainwavePatterns.find(p => p.id === selectedPattern);
        if (!pattern) return;
        
        setSessionActive(true);
        setSessionDuration(0);
        setSessionIntensity(0);
        setEgoLevel(100);
        setThoughtStream([]);
        
        // Start session timers and effects
        const durationInterval = setInterval(() => {
            setSessionDuration(prev => prev + 1);
        }, 1000);
        
        const intensityInterval = setInterval(() => {
            setSessionIntensity(prev => {
                const targetIntensity = Math.min(pattern.intensity, safetyProtocols.intensityLimit);
                if (prev >= targetIntensity) {
                    clearInterval(intensityInterval);
                    return targetIntensity;
                }
                return prev + 2;
            });
        }, 500);
        
        const egoInterval = setInterval(() => {
            setEgoLevel(prev => {
                // Ego dissolution based on pattern intensity and safety protocols
                const newLevel = safetyProtocols.egoProtection ? 
                    Math.max(40, prev - (pattern.intensity / 100)) : 
                    Math.max(0, prev - (pattern.intensity / 50));
                
                // Auto-terminate if ego level gets too low and safety is on
                if (newLevel < 20 && safetyProtocols.autoTerminate) {
                    endNeuralSession();
                    clearInterval(egoInterval);
                    return 20;
                }
                
                return newLevel;
            });
        }, 2000);
        
        // Generate thought stream
        const thoughtInterval = setInterval(() => {
            const thoughts = [
                "Consciousness expanding beyond physical form...",
                "Perceiving reality through quantum fluctuations...",
                "Time is merely a construct of limited perception...",
                "All existence is interconnected through vibration...",
                "The self is an illusion of separated consciousness...",
                "Awareness extends beyond the confines of the brain...",
                "Information exists independent of physical substrate...",
                "Reality is a consensus hallucination...",
                "The universe observes itself through us...",
                "Boundaries between mind and environment dissolving..."
            ];
            
            setThoughtStream(prev => {
                const newThought = thoughts[Math.floor(Math.random() * thoughts.length)];
                const updatedStream = [...prev, newThought];
                return updatedStream.slice(-5); // Keep only last 5 thoughts
            });
        }, 3000);
        
        // Store intervals for cleanup
        return () => {
            clearInterval(durationInterval);
            clearInterval(intensityInterval);
            clearInterval(egoInterval);
            clearInterval(thoughtInterval);
        };
    };
    
    const endNeuralSession = () => {
        setSessionActive(false);
        
        // Reset neural connection if it was transcending
        if (neuralConnection.status === 'TRANSCENDING') {
            setNeuralConnection(prev => ({
                ...prev,
                status: 'SYNCED'
            }));
        }
        
        // Return to menu after session ends
        setActiveScreen('MENU');
    };
    
    const toggleSafetyProtocol = (protocol: keyof typeof safetyProtocols) => {
        setSafetyProtocols(prev => ({
            ...prev,
            [protocol]: !prev[protocol]
        }));
    };
    
    const adjustIntensityLimit = (amount: number) => {
        setSafetyProtocols(prev => ({
            ...prev,
            intensityLimit: Math.max(10, Math.min(100, prev.intensityLimit + amount))
        }));
    };
    
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'DISCONNECTED': return 'red';
            case 'CALIBRATING': return 'yellow';
            case 'CONNECTED': return 'blue';
            case 'SYNCED': return 'green';
            case 'TRANSCENDING': return 'magenta';
            default: return 'white';
        }
    };
    
    const getRiskLevelColor = (level: string): string => {
        switch (level) {
            case 'LOW': return 'green';
            case 'MODERATE': return 'yellow';
            case 'HIGH': return 'red';
            case 'EXTREME': return 'magenta';
            default: return 'white';
        }
    };
    
    // Render the Calibration screen
    const renderCalibrateScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="cyan">Neural Interface Calibration</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Status: <Text color={getStatusColor(neuralConnection.status)}>{neuralConnection.status}</Text></Text>
            </Box>
            
            {isCalibrating ? (
                <Box flexDirection="column" marginY={1}>
                    <Text>
                        <Text color="cyan">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Calibrating neural interface...
                    </Text>
                    <Text>Progress: {calibrationProgress}%</Text>
                    <Box width={50} marginY={1}>
                        <Text>
                            {Array.from({length: 50}).map((_, i) => 
                                i < calibrationProgress / 2 ? '█' : '░'
                            ).join('')}
                        </Text>
                    </Box>
                    <Text>Establishing direct brain-to-bong connection...</Text>
                    {calibrationProgress > 30 && <Text>Mapping neural pathways...</Text>}
                    {calibrationProgress > 60 && <Text>Synchronizing consciousness wavelengths...</Text>}
                    {calibrationProgress > 90 && <Text>Finalizing quantum entanglement...</Text>}
                </Box>
            ) : (
                <Box flexDirection="column" marginY={1}>
                    {neuralConnection.status === 'DISCONNECTED' ? (
                        <>
                            <Text>Your neural interface requires calibration before use.</Text>
                            <Text>This process will establish a direct connection between</Text>
                            <Text>your consciousness and the BROIP system.</Text>
                            <Box marginY={2}>
                                <Box 
                                    backgroundColor="cyan" 
                                    paddingX={2} 
                                    paddingY={1}
                                    onPress={calibrateNeuralInterface}
                                >
                                    <Text color="black">Begin Calibration</Text>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Text bold>Neural Link Established</Text>
                            <Box marginY={1}>
                                <Text>Signal Strength: <Text color="green">{neuralConnection.signalStrength}%</Text></Text>
                                <Text>Neural Latency: <Text color="green">{neuralConnection.latency}ms</Text></Text>
                                <Text>Synchronization: <Text color="green">{neuralConnection.syncLevel}%</Text></Text>
                                {neuralConnection.activePattern && (
                                    <Text>Active Pattern: <Text color="cyan">
                                        {brainwavePatterns.find(p => p.id === neuralConnection.activePattern)?.name || 'Unknown'}
                                    </Text></Text>
                                )}
                            </Box>
                            <Box marginY={2}>
                                <Box 
                                    backgroundColor="cyan" 
                                    paddingX={2} 
                                    paddingY={1}
                                    onPress={calibrateNeuralInterface}
                                >
                                    <Text color="black">Recalibrate</Text>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Render the Patterns screen
    const renderPatternsScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="cyan">Brainwave Pattern Library</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Select a brainwave pattern to load into your neural interface</Text>
            </Box>
            
            {brainwavePatterns.map((pattern, index) => (
                <Box 
                    key={pattern.id} 
                    flexDirection="column" 
                    borderStyle="single" 
                    paddingX={2} 
                    paddingY={1} 
                    marginBottom={1}
                    borderColor={selectedPattern === pattern.id ? "cyan" : undefined}
                >
                    <Box>
                        <Text bold>{pattern.name}</Text>
                        <Text> - Risk Level: <Text color={getRiskLevelColor(pattern.riskLevel)}>{pattern.riskLevel}</Text></Text>
                    </Box>
                    <Text>{pattern.description}</Text>
                    <Box marginY={1}>
                        <Text>Intensity: {pattern.intensity}% | Frequency: {pattern.frequency}Hz | Sync: {pattern.synchronicity}%</Text>
                    </Box>
                    <Box>
                        <Text>Effects: {pattern.effects.join(', ')}</Text>
                    </Box>
                    <Box marginTop={1}>
                        <Box 
                            backgroundColor={selectedPattern === pattern.id ? "green" : "cyan"} 
                            paddingX={2} 
                            paddingY={1}
                            onPress={() => selectBrainwavePattern(pattern.id)}
                        >
                            <Text color="black">{selectedPattern === pattern.id ? "Selected" : "Select Pattern"}</Text>
                        </Box>
                    </Box>
                </Box>
            ))}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Render the Active Session screen
    const renderActiveSessionScreen = () => {
        const pattern = brainwavePatterns.find(p => p.id === selectedPattern);
        
        if (!pattern) {
            return (
                <Box flexDirection="column">
                    <Text>Error: No brainwave pattern selected</Text>
                    <Box marginTop={2}>
                        <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                            <Text color="white" onPress={() => setActiveScreen('PATTERNS')}>Select Pattern</Text>
                        </Box>
                    </Box>
                </Box>
            );
        }
        
        if (!sessionActive) {
            return (
                <Box flexDirection="column">
                    <Box marginBottom={1}>
                        <Text bold color="cyan">Neural Rip Session</Text>
                    </Box>
                    
                    <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                        <Text bold>Selected Pattern: <Text color="cyan">{pattern.name}</Text></Text>
                        <Text>Risk Level: <Text color={getRiskLevelColor(pattern.riskLevel)}>{pattern.riskLevel}</Text></Text>
                        <Text>Description: {pattern.description}</Text>
                    </Box>
                    
                    <Box marginY={1}>
                        <Text>This will initiate a direct neural rip experience using</Text>
                        <Text>the selected brainwave pattern. Your consciousness will</Text>
                        <Text>interface directly with the BROIP system, bypassing</Text>
                        <Text>physical inhalation entirely.</Text>
                    </Box>
                    
                    {pattern.riskLevel === 'HIGH' || pattern.riskLevel === 'EXTREME' ? (
                        <Box marginY={1} borderStyle="single" borderColor="red" paddingX={2} paddingY={1}>
                            <Text color="red" bold>WARNING: HIGH RISK PATTERN</Text>
                            <Text>This pattern may cause temporary ego dissolution</Text>
                            <Text>and significant alterations to perception of reality.</Text>
                            {!safetyProtocols.egoProtection && (
                                <Text bold color="red">SAFETY PROTOCOL DISABLED: Ego Protection</Text>
                            )}
                        </Box>
                    ) : null}
                    
                    <Box marginY={2}>
                        <Box 
                            backgroundColor={pattern.riskLevel === 'EXTREME' ? "red" : "green"} 
                            paddingX={2} 
                            paddingY={1}
                            onPress={startNeuralSession}
                        >
                            <Text color="white">Begin Neural Rip</Text>
                        </Box>
                    </Box>
                    
                    <Box marginTop={2}>
                        <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                            <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                        </Box>
                    </Box>
                </Box>
            );
        }
        
        return (
            <Box flexDirection="column">
                <Box marginBottom={1}>
                    <Text bold color="magenta">Neural Singularity Active</Text>
                </Box>
                
                <Box marginBottom={1} borderStyle="single" borderColor="magenta" paddingX={2} paddingY={1}>
                    <Text>Pattern: <Text bold color="cyan">{pattern.name}</Text></Text>
                    <Text>Duration: <Text bold>{Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s</Text></Text>
                    <Text>Intensity: <Text bold color={sessionIntensity > 80 ? "red" : sessionIntensity > 50 ? "yellow" : "green"}>
                        {sessionIntensity}%
                    </Text></Text>
                    <Text>Ego Integrity: <Text bold color={egoLevel < 30 ? "red" : egoLevel < 60 ? "yellow" : "green"}>
                        {egoLevel}%
                    </Text></Text>
                </Box>
                
                <Box marginY={1} borderStyle="single" paddingX={2} paddingY={1}>
                    <Text bold>Thought Stream:</Text>
                    {thoughtStream.length === 0 ? (
                        <Text italic>Awaiting consciousness expansion...</Text>
                    ) : (
                        thoughtStream.map((thought, idx) => (
                            <Text key={idx} color={idx === thoughtStream.length - 1 ? "cyan" : "white"}>
                                {thought}
                            </Text>
                        ))
                    )}
                </Box>
                
                <Box marginY={1}>
                    <Text>
                        <Text color="magenta">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Neural rip in progress...
                    </Text>
                    {neuralConnection.status === 'TRANSCENDING' && (
                        <Text color="magenta">TRANSCENDENCE STATE ACHIEVED</Text>
                    )}
                </Box>
                
                <Box marginY={2}>
                    <Box 
                        backgroundColor="red" 
                        paddingX={2} 
                        paddingY={1}
                        onPress={endNeuralSession}
                    >
                        <Text color="white">Terminate Neural Rip</Text>
                    </Box>
                </Box>
            </Box>
        );
    };
    
    // Render the Settings screen
    const renderSettingsScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="cyan">Safety Protocols & Settings</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Configure neural interface safety parameters</Text>
            </Box>
            
            <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                <Text bold>Safety Protocols</Text>
                
                <Box marginY={1}>
                    <Box 
                        borderStyle="single" 
                        borderColor={safetyProtocols.egoProtection ? "green" : "red"} 
                        paddingX={2} 
                        paddingY={1}
                        marginBottom={1}
                        onPress={() => toggleSafetyProtocol('egoProtection')}
                    >
                        <Text>Ego Protection: <Text bold color={safetyProtocols.egoProtection ? "green" : "red"}>
                            {safetyProtocols.egoProtection ? "ENABLED" : "DISABLED"}
                        </Text></Text>
                        <Text>Prevents complete ego dissolution during neural rip</Text>
                    </Box>
                    
                    <Box 
                        borderStyle="single" 
                        borderColor={safetyProtocols.realityAnchor ? "green" : "red"} 
                        paddingX={2} 
                        paddingY={1}
                        marginBottom={1}
                        onPress={() => toggleSafetyProtocol('realityAnchor')}
                    >
                        <Text>Reality Anchor: <Text bold color={safetyProtocols.realityAnchor ? "green" : "red"}>
                            {safetyProtocols.realityAnchor ? "ENABLED" : "DISABLED"}
                        </Text></Text>
                        <Text>Maintains connection to base reality during transcendence</Text>
                    </Box>
                    
                    <Box 
                        borderStyle="single" 
                        borderColor={safetyProtocols.autoTerminate ? "green" : "red"} 
                        paddingX={2} 
                        paddingY={1}
                        marginBottom={1}
                        onPress={() => toggleSafetyProtocol('autoTerminate')}
                    >
                        <Text>Auto-Terminate: <Text bold color={safetyProtocols.autoTerminate ? "green" : "red"}>
                            {safetyProtocols.autoTerminate ? "ENABLED" : "DISABLED"}
                        </Text></Text>
                        <Text>Automatically ends session if ego integrity falls below 20%</Text>
                    </Box>
                </Box>
            </Box>
            
            <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                <Text bold>Intensity Limiter</Text>
                <Text>Maximum intensity allowed: <Text bold color={
                    safetyProtocols.intensityLimit > 80 ? "red" : 
                    safetyProtocols.intensityLimit > 60 ? "yellow" : "green"
                }>{safetyProtocols.intensityLimit}%</Text></Text>
                
                <Box marginY={1}>
                    <Box 
                        backgroundColor="blue" 
                        paddingX={2} 
                        paddingY={1}
                        marginRight={1}
                        onPress={() => adjustIntensityLimit(-10)}
                    >
                        <Text color="white">- Decrease</Text>
                    </Box>
                    <Box 
                        backgroundColor="blue" 
                        paddingX={2} 
                        paddingY={1}
                        onPress={() => adjustIntensityLimit(10)}
                    >
                        <Text color="white">+ Increase</Text>
                    </Box>
                </Box>
                
                {safetyProtocols.intensityLimit > 90 && (
                    <Box borderStyle="single" borderColor="red" paddingX={2} paddingY={1} marginTop={1}>
                        <Text color="red" bold>WARNING: EXTREME INTENSITY</Text>
                        <Text>Settings above 90% may result in permanent</Text>
                        <Text>alterations to consciousness structure.</Text>
                    </Box>
                )}
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Render the appropriate screen based on activeScreen state
    if (activeScreen === 'CALIBRATE') {
        return renderCalibrateScreen();
    }
    
    if (activeScreen === 'PATTERNS') {
        return renderPatternsScreen();
    }
    
    if (activeScreen === 'ACTIVE_SESSION') {
        return renderActiveSessionScreen();
    }
    
    if (activeScreen === 'SETTINGS') {
        return renderSettingsScreen();
    }
    
    // Main menu
    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="magenta">Neural Singularity Ripping (NSR)</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>"You don't hit the bong. The bong hits you."</Text>
                <Text>Direct brain-to-bong interface - no lungs required</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text>Neural Interface Status: <Text color={getStatusColor(neuralConnection.status)}>{neuralConnection.status}</Text></Text>
                {neuralConnection.status !== 'DISCONNECTED' && (
                    <>
                        <Text>Signal Strength: {neuralConnection.signalStrength}%</Text>
                        <Text>Neural Latency: {neuralConnection.latency}ms</Text>
                        {neuralConnection.activePattern && (
                            <Text>Active Pattern: <Text color="cyan">
                                {brainwavePatterns.find(p => p.id === neuralConnection.activePattern)?.name || 'Unknown'}
                            </Text></Text>
                        )}
                    </>
                )}
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );
};

export default NeuralSingularityRipping;

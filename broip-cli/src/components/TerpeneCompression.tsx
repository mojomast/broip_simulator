import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface TerpeneCompressionProps {
    onReturn: () => void;
}

interface StrainProfile {
    id: string;
    name: string;
    type: 'INDICA' | 'SATIVA' | 'HYBRID';
    terpenes: {
        [key: string]: number;  // name: percentage
    };
    thcContent: number;
    cbdContent: number;
    effects: string[];
    compressionRatio: number;
    quality: 'mids' | 'premium' | 'exotic';
}

// New interface for TCA v3.0 results
interface CompressionResults {
    originalSize: number;
    compressedSize: number;
    fidelity: number;
    psychoactivePreservation: number;
    bandwidth: number;
    entourageEffectPreservation?: number;
    aiUpscalingFactor?: number;
    virtualQuality?: string;
    encryptionStrength?: number;
}

const TerpeneCompression: React.FC<TerpeneCompressionProps> = ({ onReturn }) => {
    const { preferences } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'ANALYZE' | 'OPTIMIZE' | 'RESULTS' | 'AI_UPSCALE' | 'ENTOURAGE_ENCRYPT'>('MENU');
    const [selectedStrain, setSelectedStrain] = useState<StrainProfile | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [upscaling, setUpscaling] = useState(false);
    const [encrypting, setEncrypting] = useState(false);
    const [optimizationProgress, setOptimizationProgress] = useState(0);
    const [compressionResults, setCompressionResults] = useState<CompressionResults | null>(null);
    
    const strainProfiles: StrainProfile[] = [
        {
            id: 'strain1',
            name: 'OG Kush',
            type: 'HYBRID',
            terpenes: {
                'Myrcene': 0.5,
                'Limonene': 0.3,
                'Caryophyllene': 0.2,
                'Pinene': 0.1
            },
            thcContent: 22,
            cbdContent: 0.1,
            effects: ['Relaxed', 'Happy', 'Euphoric', 'Hungry'],
            compressionRatio: 1.8,
            quality: 'premium'
        },
        {
            id: 'strain2',
            name: 'Blue Dream',
            type: 'HYBRID',
            terpenes: {
                'Myrcene': 0.4,
                'Pinene': 0.3,
                'Caryophyllene': 0.1,
                'Terpinolene': 0.1
            },
            thcContent: 18,
            cbdContent: 0.2,
            effects: ['Creative', 'Uplifted', 'Relaxed', 'Gentle'],
            compressionRatio: 2.1,
            quality: 'premium'
        },
        {
            id: 'strain3',
            name: 'Granddaddy Purple',
            type: 'INDICA',
            terpenes: {
                'Myrcene': 0.8,
                'Pinene': 0.1,
                'Caryophyllene': 0.05
            },
            thcContent: 23,
            cbdContent: 0.1,
            effects: ['Sleepy', 'Relaxed', 'Hungry', 'Happy'],
            compressionRatio: 1.5,
            quality: 'exotic'
        },
        {
            id: 'strain4',
            name: 'Jack Herer',
            type: 'SATIVA',
            terpenes: {
                'Terpinolene': 0.4,
                'Pinene': 0.3,
                'Caryophyllene': 0.1
            },
            thcContent: 19,
            cbdContent: 0.1,
            effects: ['Energetic', 'Creative', 'Focused', 'Uplifted'],
            compressionRatio: 2.3,
            quality: 'premium'
        },
        {
            id: 'strain5',
            name: 'Reggie Special',
            type: 'HYBRID',
            terpenes: {
                'Myrcene': 0.2,
                'Pinene': 0.1,
                'Caryophyllene': 0.05
            },
            thcContent: 12,
            cbdContent: 0.3,
            effects: ['Mild', 'Subtle', 'Short-lasting'],
            compressionRatio: 3.0,
            quality: 'mids'
        },
        {
            id: 'strain6',
            name: 'Quantum Haze',
            type: 'SATIVA',
            terpenes: {
                'Terpinolene': 0.6,
                'Ocimene': 0.4,
                'Limonene': 0.3,
                'Nerolidol': 0.2
            },
            thcContent: 28,
            cbdContent: 0.05,
            effects: ['Euphoric', 'Energetic', 'Creative', 'Time-warping'],
            compressionRatio: 1.2,
            quality: 'exotic'
        }
    ];
    
    const menuItems = [
        {
            label: '🔍 Analyze Current Strain',
            value: 'analyze'
        },
        {
            label: '⚙️ Optimize Compression',
            value: 'optimize'
        },
        {
            label: '🚀 AI Strain Upscaling',
            value: 'upscale'
        },
        {
            label: '🔐 Entourage Effect Encryption',
            value: 'encrypt'
        },
        {
            label: '📊 View Compression Results',
            value: 'results'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    
    const strainItems = strainProfiles.map(strain => ({
        label: `${strain.name} (${strain.type}) - THC: ${strain.thcContent}% [${strain.quality}]`,
        value: strain.id
    }));
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else if (item.value === 'analyze') {
            setActiveScreen('ANALYZE');
        } else if (item.value === 'optimize') {
            setActiveScreen('OPTIMIZE');
        } else if (item.value === 'upscale') {
            setActiveScreen('AI_UPSCALE');
        } else if (item.value === 'encrypt') {
            setActiveScreen('ENTOURAGE_ENCRYPT');
        } else if (item.value === 'results') {
            setActiveScreen('RESULTS');
        }
    };
    
    const handleStrainSelect = (item: { label: string; value: string }) => {
        const strain = strainProfiles.find(s => s.id === item.value);
        if (strain) {
            setSelectedStrain(strain);
            setAnalyzing(true);
            
            // Simulate ML processing
            setTimeout(() => {
                setAnalyzing(false);
                
                // Generate compression results based on strain properties
                const originalSize = Math.floor(Math.random() * 500) + 500; // 500-1000 KB
                const compressionRatio = strain.compressionRatio;
                const compressedSize = Math.floor(originalSize / compressionRatio);
                const fidelity = Math.min(98, Math.floor(Math.random() * 20) + 70 + (strain.thcContent / 2));
                const psychoactivePreservation = Math.min(99, Math.floor(Math.random() * 10) + 85);
                const bandwidth = Math.floor(compressedSize * 8 / 10); // Kbps
                
                setCompressionResults({
                    originalSize,
                    compressedSize,
                    fidelity,
                    psychoactivePreservation,
                    bandwidth,
                    entourageEffectPreservation: Math.min(95, 70 + Math.random() * 25),
                    virtualQuality: strain.quality
                });
                
                setActiveScreen('RESULTS');
            }, 2000);
        }
    };
    
    const optimizeCompression = () => {
        if (!selectedStrain || !compressionResults) return;
        
        setOptimizing(true);
        setOptimizationProgress(0);
        
        // Simulate progressive optimization
        const interval = setInterval(() => {
            setOptimizationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishOptimization();
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };
    
    const finishOptimization = () => {
        if (!compressionResults) return;
        
        // Improve the compression results with TCA v3.0
        const optimizedResults = {
            originalSize: compressionResults.originalSize,
            compressedSize: Math.floor(compressionResults.compressedSize * 0.7), // 30% smaller with v3.0
            fidelity: Math.min(99.7, compressionResults.fidelity + 7),
            psychoactivePreservation: Math.min(99.9, compressionResults.psychoactivePreservation + 5),
            bandwidth: Math.floor(compressionResults.bandwidth * 0.7), // 30% less bandwidth
            entourageEffectPreservation: Math.min(99, (compressionResults.entourageEffectPreservation || 80) + 10),
            encryptionStrength: compressionResults.encryptionStrength,
            aiUpscalingFactor: compressionResults.aiUpscalingFactor,
            virtualQuality: compressionResults.virtualQuality
        };
        
        setCompressionResults(optimizedResults);
        setOptimizing(false);
        setActiveScreen('RESULTS');
    };

    const applyAIUpscaling = () => {
        if (!selectedStrain || !compressionResults) return;
        
        setUpscaling(true);
        
        // Simulate AI upscaling process
        setTimeout(() => {
            const qualityMap = {
                'mids': 'premium',
                'premium': 'exotic',
                'exotic': 'exotic+'
            };
            
            const upscaledResults = {
                ...compressionResults,
                fidelity: Math.min(99.9, compressionResults.fidelity + 10),
                psychoactivePreservation: Math.min(99.9, compressionResults.psychoactivePreservation + 8),
                aiUpscalingFactor: selectedStrain.quality === 'mids' ? 2.5 : 1.5,
                virtualQuality: qualityMap[selectedStrain.quality as keyof typeof qualityMap]
            };
            
            setCompressionResults(upscaledResults);
            setUpscaling(false);
            setActiveScreen('RESULTS');
        }, 3000);
    };

    const applyEntourageEncryption = () => {
        if (!selectedStrain || !compressionResults) return;
        
        setEncrypting(true);
        
        // Simulate encryption process
        setTimeout(() => {
            const encryptedResults = {
                ...compressionResults,
                compressedSize: Math.floor(compressionResults.compressedSize * 0.9), // 10% smaller with encryption
                entourageEffectPreservation: 99.9, // EEE ensures no terpene left behind
                encryptionStrength: 256, // 256-bit encryption
                bandwidth: Math.floor(compressionResults.bandwidth * 0.9) // 10% bandwidth reduction
            };
            
            setCompressionResults(encryptedResults);
            setEncrypting(false);
            setActiveScreen('RESULTS');
        }, 2500);
    };
    
    // Render the Analyze screen
    const renderAnalyzeScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="green">Select Strain for TNN Analysis</Text>
            </Box>
            
            {analyzing ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Analyzing terpene profiles for {selectedStrain?.name}
                    </Text>
                    <Text>Applying Terpene Neural Network algorithms...</Text>
                    <Text>Scanning blockchain for strain provenance...</Text>
                </Box>
            ) : (
                <>
                    <Text>The Terpene Neural Network will optimize compression based on strain profile</Text>
                    <Box marginY={1}>
                        <SelectInput items={strainItems} onSelect={handleStrainSelect} />
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
    
    // Render the Optimize screen
    const renderOptimizeScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="green">TCA v3.0 Optimization</Text>
            </Box>
            
            {!selectedStrain ? (
                <Text>Please analyze a strain first</Text>
            ) : optimizing ? (
                <Box flexDirection="column" marginY={1}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Optimizing TCA v3.0 for {selectedStrain.name}
                    </Text>
                    <Text>Progress: {optimizationProgress}%</Text>
                    <Box width={50} marginY={1}>
                        <Text>
                            {Array.from({length: 50}).map((_, i) => 
                                i < optimizationProgress / 2 ? '█' : '░'
                            ).join('')}
                        </Text>
                    </Box>
                    <Text>Applying "Lossy but still lit" compression algorithms...</Text>
                    <Text>Calibrating psychedelic fidelity parameters...</Text>
                </Box>
            ) : (
                <Box flexDirection="column" marginY={1}>
                    <Text bold>Strain: {selectedStrain.name} ({selectedStrain.type})</Text>
                    <Text>THC Content: {selectedStrain.thcContent}%</Text>
                    <Text>Quality Grade: <Text color={selectedStrain.quality === 'exotic' ? 'magenta' : selectedStrain.quality === 'premium' ? 'green' : 'yellow'}>{selectedStrain.quality}</Text></Text>
                    <Text>Primary Terpenes:</Text>
                    {Object.entries(selectedStrain.terpenes).map(([name, percentage], index) => (
                        <Text key={index}>- {name}: {(percentage * 100).toFixed(1)}%</Text>
                    ))}
                    
                    <Box marginY={2}>
                        <Box 
                            backgroundColor="green" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={optimizeCompression}
                        >
                            <Text color="white">Start Optimization</Text>
                        </Box>
                    </Box>
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );

    // Render the AI Upscale screen
    const renderAIUpscaleScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="magenta">Strain-based AI Upscaling</Text>
            </Box>
            
            {!selectedStrain ? (
                <Text>Please analyze a strain first</Text>
            ) : upscaling ? (
                <Box flexDirection="column" marginY={1}>
                    <Text>
                        <Text color="magenta">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Applying AI upscaling to {selectedStrain.name}
                    </Text>
                    <Text>Converting {selectedStrain.quality} to virtual exotic...</Text>
                    <Text>Enhancing terpene profiles with generative algorithms...</Text>
                    <Text>Boosting psychoactive signature...</Text>
                </Box>
            ) : (
                <Box flexDirection="column" marginY={1}>
                    <Text bold>Strain: {selectedStrain.name} ({selectedStrain.type})</Text>
                    <Text>Current Quality: <Text color={selectedStrain.quality === 'exotic' ? 'magenta' : selectedStrain.quality === 'premium' ? 'green' : 'yellow'}>{selectedStrain.quality}</Text></Text>
                    <Text>THC Content: {selectedStrain.thcContent}%</Text>
                    
                    <Box marginY={1}>
                        <Text>AI Upscaling can transform your {selectedStrain.quality} strain into a virtual exotic experience.</Text>
                        <Text>This process uses neural networks to enhance terpene profiles and boost psychoactive signatures.</Text>
                    </Box>
                    
                    <Box marginY={2}>
                        <Box 
                            backgroundColor="magenta" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={applyAIUpscaling}
                        >
                            <Text color="white">Apply AI Upscaling</Text>
                        </Box>
                    </Box>
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );

    // Render the Entourage Encrypt screen
    const renderEntourageEncryptScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="cyan">Entourage Effect Encryption (EEE)</Text>
            </Box>
            
            {!selectedStrain ? (
                <Text>Please analyze a strain first</Text>
            ) : encrypting ? (
                <Box flexDirection="column" marginY={1}>
                    <Text>
                        <Text color="cyan">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Applying Entourage Effect Encryption to {selectedStrain.name}
                    </Text>
                    <Text>Generating 256-bit terpene keys...</Text>
                    <Text>Securing synergistic compound relationships...</Text>
                    <Text>Ensuring no terpene left behind...</Text>
                </Box>
            ) : (
                <Box flexDirection="column" marginY={1}>
                    <Text bold>Strain: {selectedStrain.name} ({selectedStrain.type})</Text>
                    <Text>Terpene Count: {Object.keys(selectedStrain.terpenes).length}</Text>
                    
                    <Box marginY={1}>
                        <Text>Entourage Effect Encryption ensures that all terpenes and cannabinoids</Text>
                        <Text>maintain their synergistic relationships during transmission.</Text>
                        <Text>This provides maximum therapeutic benefit and authentic experience.</Text>
                    </Box>
                    
                    <Box marginY={2}>
                        <Box 
                            backgroundColor="cyan" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={applyEntourageEncryption}
                        >
                            <Text color="white">Apply EEE</Text>
                        </Box>
                    </Box>
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Render the Results screen
    const renderResultsScreen = () => (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color="green">TCA v3.0 Compression Results</Text>
            </Box>
            
            {!compressionResults ? (
                <Text>No compression results available yet. Analyze a strain first.</Text>
            ) : (
                <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1}>
                    <Text bold>Strain: {selectedStrain?.name}</Text>
                    <Box marginY={1}>
                        <Text>Original Size: <Text bold>{compressionResults.originalSize} KB</Text></Text>
                        <Text>Compressed Size: <Text bold color="green">{compressionResults.compressedSize} KB</Text></Text>
                        <Text>Compression Ratio: <Text bold color="yellow">{(compressionResults.originalSize / compressionResults.compressedSize).toFixed(2)}x</Text></Text>
                    </Box>
                    
                    <Box marginY={1}>
                        <Text>Terpene Profile Fidelity: <Text bold color="cyan">{compressionResults.fidelity.toFixed(1)}%</Text></Text>
                        <Text>Psychoactive Preservation: <Text bold color="magenta">{compressionResults.psychoactivePreservation.toFixed(1)}%</Text></Text>
                        {compressionResults.entourageEffectPreservation && (
                            <Text>Entourage Effect Preservation: <Text bold color="blue">{compressionResults.entourageEffectPreservation.toFixed(1)}%</Text></Text>
                        )}
                        <Text>Required Bandwidth: <Text bold>{compressionResults.bandwidth} Kbps</Text></Text>
                    </Box>

                    {compressionResults.aiUpscalingFactor && (
                        <Box marginY={1} borderStyle="single" paddingX={1}>
                            <Text bold color="magenta">AI Upscaling Active</Text>
                            <Text>Upscaling Factor: <Text bold>{compressionResults.aiUpscalingFactor}x</Text></Text>
                            <Text>Virtual Quality: <Text bold color="magenta">{compressionResults.virtualQuality}</Text></Text>
                            <Text>(Original: <Text color="yellow">{selectedStrain?.quality}</Text>)</Text>
                        </Box>
                    )}

                    {compressionResults.encryptionStrength && (
                        <Box marginY={1} borderStyle="single" paddingX={1}>
                            <Text bold color="cyan">Entourage Effect Encryption Active</Text>
                            <Text>Encryption Strength: <Text bold>{compressionResults.encryptionStrength}-bit</Text></Text>
                            <Text>Terpene Security: <Text bold color="green">Maximum</Text></Text>
                        </Box>
                    )}
                    
                    <Box marginY={1}>
                        <Text>{getCompressionQualityMessage(compressionResults)}</Text>
                    </Box>
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    const getCompressionQualityMessage = (results: CompressionResults): string => {
        if (results.aiUpscalingFactor && results.encryptionStrength) {
            return "🔮 ULTIMATE QUALITY: AI-enhanced, encrypted terpenes - beyond natural limits";
        }
        if (results.aiUpscalingFactor) {
            return "💎 ENHANCED QUALITY: AI has transformed this strain into virtual exotic";
        }
        if (results.encryptionStrength) {
            return "🔒 SECURED QUALITY: Entourage Effect Encryption ensures therapeutic integrity";
        }
        if (results.fidelity > 97) return "💯 Exceptional terpene preservation - indistinguishable from local experience";
        if (results.fidelity > 92) return "⭐ Excellent quality - minimal loss of subtle notes";
        if (results.fidelity > 85) return "👍 Good quality - primary effects preserved";
        return "✅ Acceptable quality - main effects present but some subtlety lost";
    };
    
    if (activeScreen === 'ANALYZE') {
        return renderAnalyzeScreen();
    }
    
    if (activeScreen === 'OPTIMIZE') {
        return renderOptimizeScreen();
    }
    
    if (activeScreen === 'AI_UPSCALE') {
        return renderAIUpscaleScreen();
    }
    
    if (activeScreen === 'ENTOURAGE_ENCRYPT') {
        return renderEntourageEncryptScreen();
    }
    
    if (activeScreen === 'RESULTS') {
        return renderResultsScreen();
    }
    
    // Main menu
    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Enhanced Terpene Compression Algorithm v3.0</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>"Lossy but still lit" compression with strain-based AI upscaling</Text>
                <Text>and Entourage Effect Encryption (EEE)</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text>Current Settings:</Text>
                <Text>Optimization Level: <Text color="yellow">{preferences.routeOptimizationLevel}</Text></Text>
                <Text>Simulation Fidelity: <Text color="cyan">{preferences.simulationFidelity}</Text></Text>
                {selectedStrain && (
                    <>
                        <Text>Active Strain: <Text color="green">{selectedStrain.name}</Text></Text>
                        <Text>Quality: <Text color={selectedStrain.quality === 'exotic' ? 'magenta' : selectedStrain.quality === 'premium' ? 'green' : 'yellow'}>{selectedStrain.quality}</Text></Text>
                    </>
                )}
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );
};

export default TerpeneCompression;

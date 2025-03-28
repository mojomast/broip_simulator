import React, { useState, useEffect } from 'react';
import { Box, Text } from './common';
import { useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface SensoryOutputProps {
    onReturn: () => void;
}

interface Device {
    id: string;
    name: string;
    type: 'HUMIDIFIER' | 'LED_LIGHT' | 'SUBWOOFER' | 'HAPTIC_VEST' | 'SCENT_DIFFUSER' | 'SMART_SPEAKER' | 'SMART_BONG';
    status: 'CONNECTED' | 'DISCONNECTED' | 'PAIRING' | 'LOW_BATTERY';
    battery?: number;
    intensity: number;
    mode: string;
    supportedModes: string[];
    waterLevel?: number; // For SMART_BONG
    temperature?: number; // For SMART_BONG
    filtrationPattern?: string; // For SMART_BONG
}

interface SensoryProfile {
    id: string;
    name: string;
    description: string;
    deviceSettings: {
        deviceId: string;
        intensity: number;
        mode: string;
    }[];
    active: boolean;
}

const SensoryOutput: React.FC<SensoryOutputProps> = ({ onReturn }) => {
    const { preferences } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'DEVICES' | 'PROFILES' | 'DEMO'>('MENU');
    const [devices, setDevices] = useState<Device[]>([]);
    const [profiles, setProfiles] = useState<SensoryProfile[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const [isPairing, setIsPairing] = useState(false);
    const [isRunningDemo, setIsRunningDemo] = useState(false);
    const [demoProgress, setDemoProgress] = useState(0);
    const [demoIntensity, setDemoIntensity] = useState(50);
    
    // Initialize devices and profiles
    useEffect(() => {
        const initialDevices: Device[] = [
            {
                id: 'hum1',
                name: 'CloudMaker Pro',
                type: 'HUMIDIFIER',
                status: 'CONNECTED',
                battery: 78,
                intensity: 65,
                mode: 'PULSE',
                supportedModes: ['CONTINUOUS', 'PULSE', 'WAVE']
            },
            {
                id: 'led1',
                name: 'HueMood Light Strip',
                type: 'LED_LIGHT',
                status: 'CONNECTED',
                intensity: 80,
                mode: 'AMBIENT',
                supportedModes: ['AMBIENT', 'REACTIVE', 'RIPPLE', 'STROBE']
            },
            {
                id: 'sub1',
                name: 'BassRip Subwoofer',
                type: 'SUBWOOFER',
                status: 'CONNECTED',
                intensity: 55,
                mode: 'DEEP_RUMBLE',
                supportedModes: ['CHEST_HIT', 'DEEP_RUMBLE', 'WALL_SHAKER', 'NEIGHBOR_ANNOYER', 'BASS_BOOSTED_EXHALE']
            },
            {
                id: 'vest1',
                name: 'PulseVest Pro',
                type: 'HAPTIC_VEST',
                status: 'DISCONNECTED',
                battery: 0,
                intensity: 0,
                mode: 'OFF',
                supportedModes: ['CHEST_HIT', 'FULL_BODY', 'WAVE', 'TARGETED']
            },
            {
                id: 'scent1',
                name: 'TerpMist Diffuser',
                type: 'SCENT_DIFFUSER',
                status: 'CONNECTED',
                battery: 92,
                intensity: 40,
                mode: 'SUBTLE',
                supportedModes: ['SUBTLE', 'BURST', 'CLOUD']
            },
            {
                id: 'bong1',
                name: 'SmartBong Pro',
                type: 'SMART_BONG',
                status: 'CONNECTED',
                intensity: 50,
                mode: 'DEFAULT',
                supportedModes: ['DEFAULT', 'SMOOTH', 'INTENSE'],
                waterLevel: 75,
                temperature: 25,
                filtrationPattern: 'CLOUD'
            }
        ];
        
        const initialProfiles: SensoryProfile[] = [
            {
                id: 'prof1',
                name: 'Chill Session',
                description: 'Subtle ambient experience with gentle feedback',
                deviceSettings: [
                    { deviceId: 'hum1', intensity: 40, mode: 'CONTINUOUS' },
                    { deviceId: 'led1', intensity: 60, mode: 'AMBIENT' },
                    { deviceId: 'sub1', intensity: 30, mode: 'DEEP_RUMBLE' },
                    { deviceId: 'scent1', intensity: 25, mode: 'SUBTLE' }
                ],
                active: true
            },
            {
                id: 'prof2',
                name: 'Bass Drop',
                description: 'Intense chest-hitting experience with reactive lighting',
                deviceSettings: [
                    { deviceId: 'hum1', intensity: 80, mode: 'PULSE' },
                    { deviceId: 'led1', intensity: 100, mode: 'REACTIVE' },
                    { deviceId: 'sub1', intensity: 90, mode: 'CHEST_HIT' },
                    { deviceId: 'scent1', intensity: 70, mode: 'BURST' }
                ],
                active: false
            },
            {
                id: 'prof3',
                name: 'Ambient Background',
                description: 'Minimal sensory output for subtle enhancement',
                deviceSettings: [
                    { deviceId: 'led1', intensity: 30, mode: 'AMBIENT' },
                    { deviceId: 'scent1', intensity: 20, mode: 'SUBTLE' }
                ],
                active: false
            },
            {
                id: 'prof4',
                name: 'Full Immersion',
                description: 'Maximum sensory experience across all devices',
                deviceSettings: [
                    { deviceId: 'hum1', intensity: 100, mode: 'PULSE' },
                    { deviceId: 'led1', intensity: 100, mode: 'REACTIVE' },
                    { deviceId: 'sub1', intensity: 100, mode: 'BASS_BOOSTED_EXHALE' },
                    { deviceId: 'scent1', intensity: 90, mode: 'BURST' },
                    { deviceId: 'bong1', intensity: 80, mode: 'INTENSE' }
                ],
                active: false
            },
            {
                id: 'prof5',
                name: 'Stealth Mode',
                description: 'Sensory feedback without noise - perfect for late night sessions',
                deviceSettings: [
                    { deviceId: 'led1', intensity: 50, mode: 'AMBIENT' },
                    { deviceId: 'vest1', intensity: 70, mode: 'TARGETED' },
                    { deviceId: 'scent1', intensity: 30, mode: 'SUBTLE' },
                    { deviceId: 'bong1', intensity: 40, mode: 'SMOOTH' }
                ],
                active: false
            }
        ];
        
        setDevices(initialDevices);
        setProfiles(initialProfiles);
    }, []);
    
    const menuItems = [
        {
            label: '🔌 Manage Devices',
            value: 'devices'
        },
        {
            label: '🎛️ Sensory Profiles',
            value: 'profiles'
        },
        {
            label: '🎮 Run Demo Experience',
            value: 'demo'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    
    const getDeviceTypeIcon = (type: string): string => {
        switch (type) {
            case 'HUMIDIFIER': return '💨';
            case 'LED_LIGHT': return '💡';
            case 'SUBWOOFER': return '🔊';
            case 'HAPTIC_VEST': return '👕';
            case 'SCENT_DIFFUSER': return '🌿';
            case 'SMART_SPEAKER': return '🔈';
            case 'SMART_BONG': return '🌱';
            default: return '📱';
        }
    };
    
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'CONNECTED': return 'green';
            case 'DISCONNECTED': return 'red';
            case 'PAIRING': return 'yellow';
            case 'LOW_BATTERY': return 'yellow';
            default: return 'white';
        }
    };
    
    const getBatteryIcon = (percentage: number | undefined): string => {
        if (percentage === undefined) return '';
        if (percentage >= 80) return '🔋';
        if (percentage >= 40) return '🔋';
        if (percentage >= 10) return '🪫';
        return '🪫';
    };
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else {
            setActiveScreen(item.value as 'DEVICES' | 'PROFILES' | 'DEMO');
        }
    };
    
    const pairNewDevice = () => {
        setIsPairing(true);
        
        // Simulate pairing process
        setTimeout(() => {
            // Create new random device
            const deviceTypes: Array<Device['type']> = [
                'HUMIDIFIER', 'LED_LIGHT', 'SUBWOOFER', 'HAPTIC_VEST', 'SCENT_DIFFUSER', 'SMART_SPEAKER', 'SMART_BONG'
            ];
            const randomType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
            
            const newDevice: Device = {
                id: `dev${Math.random().toString(36).substr(2, 4)}`,
                name: generateDeviceName(randomType),
                type: randomType,
                status: 'CONNECTED',
                battery: Math.floor(Math.random() * 100),
                intensity: 50,
                mode: 'DEFAULT',
                supportedModes: ['DEFAULT', 'AMBIENT', 'INTENSE']
            };
            
            if (newDevice.type === 'SMART_BONG') {
                newDevice.waterLevel = Math.floor(Math.random() * 100);
                newDevice.temperature = Math.floor(Math.random() * 30);
                newDevice.filtrationPattern = 'CLOUD';
            }
            
            setDevices(prev => [...prev, newDevice]);
            setSelectedDevice(newDevice.id);
            setIsPairing(false);
        }, 3000);
    };
    
    const generateDeviceName = (type: string): string => {
        const prefixes = {
            'HUMIDIFIER': ['MistMaker', 'VaporCloud', 'HumidSense'],
            'LED_LIGHT': ['GlowStrip', 'AuraLight', 'VibeGlow'],
            'SUBWOOFER': ['BassDrop', 'RumbleBox', 'ThunderBass'],
            'HAPTIC_VEST': ['FeedbackWear', 'PulseVest', 'VibeJacket'],
            'SCENT_DIFFUSER': ['AromaMist', 'TerpDiffuser', 'ScentWave'],
            'SMART_SPEAKER': ['EchoRip', 'SoundPulse', 'AudioCloud'],
            'SMART_BONG': ['SmartBong', 'BongPro', 'VapeBong']
        };
        
        const prefix = prefixes[type as keyof typeof prefixes]?.[Math.floor(Math.random() * 3)] || 'Smart';
        return `${prefix} ${Math.floor(Math.random() * 9000 + 1000)}`;
    };
    
    const activateProfile = (profileId: string) => {
        // Update profiles, setting only the selected one as active
        setProfiles(prev => prev.map(profile => ({
            ...profile,
            active: profile.id === profileId
        })));
        
        // Update devices according to profile settings
        const profile = profiles.find(p => p.id === profileId);
        if (profile) {
            setDevices(prev => prev.map(device => {
                const setting = profile.deviceSettings.find(s => s.deviceId === device.id);
                if (setting && device.status === 'CONNECTED') {
                    return {
                        ...device,
                        intensity: setting.intensity,
                        mode: setting.mode
                    };
                }
                return device;
            }));
        }
    };
    
    const toggleDeviceStatus = (deviceId: string) => {
        setDevices(prev => prev.map(device => {
            if (device.id === deviceId) {
                const newStatus = device.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
                return {
                    ...device,
                    status: newStatus,
                    intensity: newStatus === 'CONNECTED' ? device.intensity : 0
                };
            }
            return device;
        }));
    };
    
    const changeDeviceIntensity = (deviceId: string, intensity: number) => {
        setDevices(prev => prev.map(device => {
            if (device.id === deviceId) {
                return {
                    ...device,
                    intensity: Math.max(0, Math.min(100, intensity))
                };
            }
            return device;
        }));
    };
    
    const runDemoExperience = () => {
        setIsRunningDemo(true);
        setDemoProgress(0);
        
        // Change all connected devices to reactive mode
        setDevices(prev => prev.map(device => {
            if (device.status === 'CONNECTED') {
                return {
                    ...device,
                    mode: device.supportedModes.includes('REACTIVE') ? 'REACTIVE' : 
                           device.supportedModes.includes('PULSE') ? 'PULSE' : 
                           device.supportedModes[0],
                    intensity: demoIntensity
                };
            }
            return device;
        }));
        
        // Simulate demo progression
        const interval = setInterval(() => {
            setDemoProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Reset devices after demo
                    const activeProfile = profiles.find(p => p.active);
                    if (activeProfile) {
                        activateProfile(activeProfile.id);
                    }
                    setIsRunningDemo(false);
                    return 100;
                }
                
                // Randomly vary intensities during demo to simulate response to rip
                setDevices(prev => prev.map(device => {
                    if (device.status === 'CONNECTED') {
                        // Create a wave pattern effect
                        const baseIntensity = demoIntensity;
                        const variance = Math.sin(Date.now() / 500) * 30;
                        
                        return {
                            ...device,
                            intensity: Math.max(10, Math.min(100, baseIntensity + variance))
                        };
                    }
                    return device;
                }));
                
                return prev + 2;
            });
        }, 200);
    };
    
    const getSubwooferModeDescription = (mode: string): string => {
        switch (mode) {
            case 'CHEST_HIT': return 'Focused bass impact that simulates the chest sensation of a massive hit';
            case 'DEEP_RUMBLE': return 'Low-frequency vibrations that create an ambient rumble';
            case 'WALL_SHAKER': return 'High-power mode that literally shakes the walls';
            case 'NEIGHBOR_ANNOYER': return 'Maximum bass projection - guaranteed to annoy neighbors';
            case 'BASS_BOOSTED_EXHALE': return 'Syncs with exhale pattern for bass-boosted waveform experience';
            default: return 'Standard bass output';
        }
    };
    
    // Main menu screen
    const renderMenuScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Cross-Platform Sensory Output Integration</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Manage and control your IoT devices for full-sensory immersion</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text>Connected Devices: <Text bold color="green">
                    {devices.filter(d => d.status === 'CONNECTED').length}/{devices.length}
                </Text></Text>
                <Text>Active Profile: <Text bold color="cyan">
                    {profiles.find(p => p.active)?.name || 'None'}
                </Text></Text>
                <Text>Simulation Fidelity: <Text bold color="yellow">
                    {preferences.simulationFidelity.toUpperCase()}
                </Text></Text>
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );
    
    // Devices screen
    const renderDevicesScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Manage Sensory Devices</Text>
            </Box>
            
            {isPairing ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Scanning for nearby devices...
                    </Text>
                    <Text>Please ensure your device is in pairing mode</Text>
                </Box>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Box backgroundColor="green" paddingX={2} paddingY={1}>
                            <Text color="white" onPress={pairNewDevice}>Add New Device</Text>
                        </Box>
                    </Box>
                    
                    <Box flexDirection="column">
                        {devices.map(device => (
                            <Box 
                                key={device.id} 
                                flexDirection="column"
                                borderStyle={selectedDevice === device.id ? "double" : "single"}
                                paddingX={2}
                                paddingY={1}
                                marginBottom={1}
                                onPress={() => setSelectedDevice(device.id)}
                            >
                                <Box>
                                    <Text>{getDeviceTypeIcon(device.type)} {device.name}</Text>
                                    <Text> - </Text>
                                    <Text color={getStatusColor(device.status)}>{device.status}</Text>
                                    {device.battery !== undefined && (
                                        <Text> {getBatteryIcon(device.battery)} {device.battery}%</Text>
                                    )}
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text>Mode: {device.mode}</Text>
                                    <Text> • </Text>
                                    <Text>Intensity: <Text color={
                                        device.intensity > 70 ? 'red' :
                                        device.intensity > 40 ? 'yellow' : 'green'
                                    }>{device.intensity}%</Text></Text>
                                </Box>
                                
                                {selectedDevice === device.id && (
                                    <>
                                        <Box marginTop={1} flexDirection="column">
                                            <Text>Supported Modes:</Text>
                                            <Text>{device.supportedModes.join(', ')}</Text>
                                        </Box>
                                        
                                        {device.type === 'SMART_BONG' && (
                                            <Box marginTop={1} flexDirection="column">
                                                <Text>Water Level: {device.waterLevel}%</Text>
                                                <Text>Temperature: {device.temperature}°C</Text>
                                                <Text>Filtration Pattern: {device.filtrationPattern}</Text>
                                            </Box>
                                        )}
                                        
                                        {device.type === 'SUBWOOFER' && (
                                            <Box marginTop={1} flexDirection="column">
                                                <Text bold>Mode Description:</Text>
                                                <Text>{getSubwooferModeDescription(device.mode)}</Text>
                                                {device.mode === 'BASS_BOOSTED_EXHALE' && (
                                                    <Text color="yellow">✨ Bass-Boosted Exhale Waveform Active ✨</Text>
                                                )}
                                            </Box>
                                        )}
                                        
                                        <Box marginTop={1}>
                                            <Box 
                                                backgroundColor={device.status === 'CONNECTED' ? "red" : "green"} 
                                                paddingX={2} 
                                                paddingY={1}
                                                marginRight={1}
                                                onPress={() => toggleDeviceStatus(device.id)}
                                            >
                                                <Text color="white">
                                                    {device.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
                                                </Text>
                                            </Box>
                                            
                                            {device.status === 'CONNECTED' && (
                                                <>
                                                    <Box 
                                                        backgroundColor="blue" 
                                                        paddingX={2} 
                                                        paddingY={1}
                                                        marginRight={1}
                                                        onPress={() => changeDeviceIntensity(device.id, device.intensity - 10)}
                                                    >
                                                        <Text color="white">-10%</Text>
                                                    </Box>
                                                    
                                                    <Box 
                                                        backgroundColor="blue" 
                                                        paddingX={2} 
                                                        paddingY={1}
                                                        onPress={() => changeDeviceIntensity(device.id, device.intensity + 10)}
                                                    >
                                                        <Text color="white">+10%</Text>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </>
                                )}
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
    
    // Profiles screen
    const renderProfilesScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Sensory Experience Profiles</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Configure and save device groups for different experiences</Text>
            </Box>
            
            <Box flexDirection="column">
                {profiles.map(profile => (
                    <Box 
                        key={profile.id} 
                        flexDirection="column"
                        borderStyle={profile.active ? "double" : "single"}
                        borderColor={profile.active ? "green" : undefined}
                        paddingX={2}
                        paddingY={1}
                        marginBottom={1}
                        onPress={() => setSelectedProfile(profile.id)}
                    >
                        <Box>
                            <Text bold>{profile.name}</Text>
                            {profile.active && (
                                <Text color="green"> (ACTIVE)</Text>
                            )}
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>{profile.description}</Text>
                        </Box>
                        
                        {selectedProfile === profile.id && (
                            <>
                                <Box marginTop={1} flexDirection="column">
                                    <Text>Device Settings:</Text>
                                    {profile.deviceSettings.map((setting, index) => {
                                        const device = devices.find(d => d.id === setting.deviceId);
                                        return device ? (
                                            <Text key={index}>
                                                - {device.name}: {setting.mode} at {setting.intensity}% intensity
                                            </Text>
                                        ) : null;
                                    })}
                                </Box>
                                
                                <Box marginTop={1}>
                                    {!profile.active && (
                                        <Box 
                                            backgroundColor="green" 
                                            paddingX={2} 
                                            paddingY={1}
                                            onPress={() => activateProfile(profile.id)}
                                        >
                                            <Text color="white">Activate Profile</Text>
                                        </Box>
                                    )}
                                </Box>
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
    
    // Demo experience screen
    const renderDemoScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Sensory Demo Experience</Text>
            </Box>
            
            {isRunningDemo ? (
                <Box flexDirection="column" marginY={1}>
                    <Text bold color="cyan">Immersive Demo in Progress</Text>
                    <Box marginY={1}>
                        <Text>Progress: {demoProgress}%</Text>
                        <Box width={50} marginY={1}>
                            <Text>
                                {Array.from({length: 50}).map((_, i) => 
                                    i < demoProgress / 2 ? '█' : '░'
                                ).join('')}
                            </Text>
                        </Box>
                    </Box>
                    
                    <Box marginY={1} flexDirection="column">
                        <Text>Active Sensory Outputs:</Text>
                        {devices
                            .filter(d => d.status === 'CONNECTED')
                            .map(device => (
                                <Box key={device.id} marginTop={1}>
                                    <Text>{getDeviceTypeIcon(device.type)} {device.name}: </Text>
                                    <Text color={
                                        device.intensity > 80 ? 'red' :
                                        device.intensity > 50 ? 'yellow' : 'green'
                                    }>
                                        {device.type === 'SUBWOOFER' && device.mode === 'BASS_BOOSTED_EXHALE' ? 
                                            `${device.intensity}% [BASS-BOOSTED]` : 
                                            `${device.intensity}%`}
                                    </Text>
                                </Box>
                            ))}
                    </Box>
                    
                    <Box marginTop={2}>
                        <Text color="yellow">Please wait for the experience to complete...</Text>
                    </Box>
                </Box>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Text>Test your sensory output devices with a simulated experience</Text>
                    </Box>
                    
                    <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                        <Text bold>Demo Settings</Text>
                        
                        <Box marginY={1}>
                            <Text>Intensity Level: {demoIntensity}%</Text>
                            <Box width={50} marginY={1}>
                                <Text>
                                    {Array.from({length: 50}).map((_, i) => 
                                        i < demoIntensity / 2 ? '█' : '░'
                                    ).join('')}
                                </Text>
                            </Box>
                        </Box>
                        
                        <Box marginY={1}>
                            <Box 
                                backgroundColor="blue" 
                                paddingX={2} 
                                paddingY={1}
                                marginRight={1}
                                onPress={() => setDemoIntensity(Math.max(10, demoIntensity - 10))}
                            >
                                <Text color="white">Lower Intensity</Text>
                            </Box>
                            
                            <Box 
                                backgroundColor="blue" 
                                paddingX={2} 
                                paddingY={1}
                                onPress={() => setDemoIntensity(Math.min(100, demoIntensity + 10))}
                            >
                                <Text color="white">Raise Intensity</Text>
                            </Box>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Ready Devices:</Text>
                            {devices
                                .filter(d => d.status === 'CONNECTED')
                                .map(device => (
                                    <Text key={device.id}>- {device.name}</Text>
                                ))}
                        </Box>
                    </Box>
                    
                    <Box marginTop={1}>
                        <Box 
                            backgroundColor="green" 
                            paddingX={2} 
                            paddingY={1}
                            onPress={runDemoExperience}
                        >
                            <Text color="white">Start Demo Experience</Text>
                        </Box>
                    </Box>
                </>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => {
                        if (!isRunningDemo) {
                            setActiveScreen('MENU');
                        }
                    }}>
                        {isRunningDemo ? 'Please Wait...' : 'Back'}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
    
    if (activeScreen === 'DEVICES') {
        return renderDevicesScreen();
    }
    
    if (activeScreen === 'PROFILES') {
        return renderProfilesScreen();
    }
    
    if (activeScreen === 'DEMO') {
        return renderDemoScreen();
    }
    
    return renderMenuScreen();
};

export default SensoryOutput;

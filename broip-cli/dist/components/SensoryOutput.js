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
const UserContext_1 = require("../utils/UserContext");
const SensoryOutput = ({ onReturn }) => {
    const { preferences } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [devices, setDevices] = (0, react_1.useState)([]);
    const [profiles, setProfiles] = (0, react_1.useState)([]);
    const [selectedDevice, setSelectedDevice] = (0, react_1.useState)(null);
    const [selectedProfile, setSelectedProfile] = (0, react_1.useState)(null);
    const [isPairing, setIsPairing] = (0, react_1.useState)(false);
    const [isRunningDemo, setIsRunningDemo] = (0, react_1.useState)(false);
    const [demoProgress, setDemoProgress] = (0, react_1.useState)(0);
    const [demoIntensity, setDemoIntensity] = (0, react_1.useState)(50);
    // Initialize devices and profiles
    (0, react_1.useEffect)(() => {
        const initialDevices = [
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
        const initialProfiles = [
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
    const getDeviceTypeIcon = (type) => {
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
    const getStatusColor = (status) => {
        switch (status) {
            case 'CONNECTED': return 'green';
            case 'DISCONNECTED': return 'red';
            case 'PAIRING': return 'yellow';
            case 'LOW_BATTERY': return 'yellow';
            default: return 'white';
        }
    };
    const getBatteryIcon = (percentage) => {
        if (percentage === undefined)
            return '';
        if (percentage >= 80)
            return '🔋';
        if (percentage >= 40)
            return '🔋';
        if (percentage >= 10)
            return '🪫';
        return '🪫';
    };
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else {
            setActiveScreen(item.value);
        }
    };
    const pairNewDevice = () => {
        setIsPairing(true);
        // Simulate pairing process
        setTimeout(() => {
            // Create new random device
            const deviceTypes = [
                'HUMIDIFIER', 'LED_LIGHT', 'SUBWOOFER', 'HAPTIC_VEST', 'SCENT_DIFFUSER', 'SMART_SPEAKER', 'SMART_BONG'
            ];
            const randomType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
            const newDevice = {
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
    const generateDeviceName = (type) => {
        const prefixes = {
            'HUMIDIFIER': ['MistMaker', 'VaporCloud', 'HumidSense'],
            'LED_LIGHT': ['GlowStrip', 'AuraLight', 'VibeGlow'],
            'SUBWOOFER': ['BassDrop', 'RumbleBox', 'ThunderBass'],
            'HAPTIC_VEST': ['FeedbackWear', 'PulseVest', 'VibeJacket'],
            'SCENT_DIFFUSER': ['AromaMist', 'TerpDiffuser', 'ScentWave'],
            'SMART_SPEAKER': ['EchoRip', 'SoundPulse', 'AudioCloud'],
            'SMART_BONG': ['SmartBong', 'BongPro', 'VapeBong']
        };
        const prefix = prefixes[type]?.[Math.floor(Math.random() * 3)] || 'Smart';
        return `${prefix} ${Math.floor(Math.random() * 9000 + 1000)}`;
    };
    const activateProfile = (profileId) => {
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
    const toggleDeviceStatus = (deviceId) => {
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
    const changeDeviceIntensity = (deviceId, intensity) => {
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
    const getSubwooferModeDescription = (mode) => {
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
    const renderMenuScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Cross-Platform Sensory Output Integration")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Manage and control your IoT devices for full-sensory immersion")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Connected Devices: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "green" },
                    devices.filter(d => d.status === 'CONNECTED').length,
                    "/",
                    devices.length)),
            react_1.default.createElement(ink_1.Text, null,
                "Active Profile: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, profiles.find(p => p.active)?.name || 'None')),
            react_1.default.createElement(ink_1.Text, null,
                "Simulation Fidelity: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" }, preferences.simulationFidelity.toUpperCase()))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
    // Devices screen
    const renderDevicesScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Manage Sensory Devices")),
        isPairing ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Scanning for nearby devices..."),
            react_1.default.createElement(ink_1.Text, null, "Please ensure your device is in pairing mode"))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1 },
                    react_1.default.createElement(ink_1.Text, { color: "white", onPress: pairNewDevice }, "Add New Device"))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, devices.map(device => (react_1.default.createElement(ink_1.Box, { key: device.id, flexDirection: "column", borderStyle: selectedDevice === device.id ? "double" : "single", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedDevice(device.id) },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, null,
                        getDeviceTypeIcon(device.type),
                        " ",
                        device.name),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: getStatusColor(device.status) }, device.status),
                    device.battery !== undefined && (react_1.default.createElement(ink_1.Text, null,
                        " ",
                        getBatteryIcon(device.battery),
                        " ",
                        device.battery,
                        "%"))),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "Mode: ",
                        device.mode),
                    react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                    react_1.default.createElement(ink_1.Text, null,
                        "Intensity: ",
                        react_1.default.createElement(ink_1.Text, { color: device.intensity > 70 ? 'red' :
                                device.intensity > 40 ? 'yellow' : 'green' },
                            device.intensity,
                            "%"))),
                selectedDevice === device.id && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, null, "Supported Modes:"),
                        react_1.default.createElement(ink_1.Text, null, device.supportedModes.join(', '))),
                    device.type === 'SMART_BONG' && (react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, null,
                            "Water Level: ",
                            device.waterLevel,
                            "%"),
                        react_1.default.createElement(ink_1.Text, null,
                            "Temperature: ",
                            device.temperature,
                            "\u00B0C"),
                        react_1.default.createElement(ink_1.Text, null,
                            "Filtration Pattern: ",
                            device.filtrationPattern))),
                    device.type === 'SUBWOOFER' && (react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, { bold: true }, "Mode Description:"),
                        react_1.default.createElement(ink_1.Text, null, getSubwooferModeDescription(device.mode)),
                        device.mode === 'BASS_BOOSTED_EXHALE' && (react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u2728 Bass-Boosted Exhale Waveform Active \u2728")))),
                    react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                        react_1.default.createElement(ink_1.Box, { backgroundColor: device.status === 'CONNECTED' ? "red" : "green", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => toggleDeviceStatus(device.id) },
                            react_1.default.createElement(ink_1.Text, { color: "white" }, device.status === 'CONNECTED' ? 'Disconnect' : 'Connect')),
                        device.status === 'CONNECTED' && (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => changeDeviceIntensity(device.id, device.intensity - 10) },
                                react_1.default.createElement(ink_1.Text, { color: "white" }, "-10%")),
                            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => changeDeviceIntensity(device.id, device.intensity + 10) },
                                react_1.default.createElement(ink_1.Text, { color: "white" }, "+10%"))))))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Profiles screen
    const renderProfilesScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Sensory Experience Profiles")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Configure and save device groups for different experiences")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, profiles.map(profile => (react_1.default.createElement(ink_1.Box, { key: profile.id, flexDirection: "column", borderStyle: profile.active ? "double" : "single", borderColor: profile.active ? "green" : undefined, paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedProfile(profile.id) },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, profile.name),
                profile.active && (react_1.default.createElement(ink_1.Text, { color: "green" }, " (ACTIVE)"))),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null, profile.description)),
            selectedProfile === profile.id && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, null, "Device Settings:"),
                    profile.deviceSettings.map((setting, index) => {
                        const device = devices.find(d => d.id === setting.deviceId);
                        return device ? (react_1.default.createElement(ink_1.Text, { key: index },
                            "- ",
                            device.name,
                            ": ",
                            setting.mode,
                            " at ",
                            setting.intensity,
                            "% intensity")) : null;
                    })),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 }, !profile.active && (react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, onPress: () => activateProfile(profile.id) },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Activate Profile")))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Demo experience screen
    const renderDemoScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Sensory Demo Experience")),
        isRunningDemo ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Immersive Demo in Progress"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Progress: ",
                    demoProgress,
                    "%"),
                react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < demoProgress / 2 ? '█' : '░').join('')))),
            react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null, "Active Sensory Outputs:"),
                devices
                    .filter(d => d.status === 'CONNECTED')
                    .map(device => (react_1.default.createElement(ink_1.Box, { key: device.id, marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        getDeviceTypeIcon(device.type),
                        " ",
                        device.name,
                        ": "),
                    react_1.default.createElement(ink_1.Text, { color: device.intensity > 80 ? 'red' :
                            device.intensity > 50 ? 'yellow' : 'green' }, device.type === 'SUBWOOFER' && device.mode === 'BASS_BOOSTED_EXHALE' ?
                        `${device.intensity}% [BASS-BOOSTED]` :
                        `${device.intensity}%`))))),
            react_1.default.createElement(ink_1.Box, { marginTop: 2 },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "Please wait for the experience to complete...")))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Test your sensory output devices with a simulated experience")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Demo Settings"),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "Intensity Level: ",
                        demoIntensity,
                        "%"),
                    react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                        react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < demoIntensity / 2 ? '█' : '░').join('')))),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => setDemoIntensity(Math.max(10, demoIntensity - 10)) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Lower Intensity")),
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => setDemoIntensity(Math.min(100, demoIntensity + 10)) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Raise Intensity"))),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Ready Devices:"),
                    devices
                        .filter(d => d.status === 'CONNECTED')
                        .map(device => (react_1.default.createElement(ink_1.Text, { key: device.id },
                        "- ",
                        device.name))))),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, onPress: runDemoExperience },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Start Demo Experience"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => {
                        if (!isRunningDemo) {
                            setActiveScreen('MENU');
                        }
                    } }, isRunningDemo ? 'Please Wait...' : 'Back')))));
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
exports.default = SensoryOutput;

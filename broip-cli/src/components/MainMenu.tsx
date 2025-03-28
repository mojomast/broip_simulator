import React, {useState, useEffect} from 'react';
import { Box, Text } from './common';
import SelectInput from 'ink-select-input';
import {MenuOption} from '../utils/types';
import RipInitiator from './RipInitiator';
import SystemMonitor from './SystemMonitor';
import CrystalAnalyzer from './CrystalAnalyzer';
import DiffusionConfig from './DiffusionConfig';
import BowlStatus from './BowlStatus';
import DabMarket from './DabMarket';
import FriendsList from './FriendsList';
import RoutePlanner from './RoutePlanner';
import Achievements from './Achievements';
import SensoryOutput from './SensoryOutput';
import RipAPI from './RipAPI';
import DecentralizedLedger from './DecentralizedLedger';
import LegalMode from './LegalMode';
import AutoCarb from './AutoCarb';
import NeuralSingularityRipping from './NeuralSingularityRipping';
import { useUser } from '../utils/UserContext';

const MainMenu: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<'menu' | 'ri' | 'monitor' | 'crystal' | 'diffusion' | 'bowl' | 'market' | 'friends' | 'routes' | 'achievements' | 'sensory' | 'ripapi' | 'ledger' | 'legal' | 'autocarb' | 'neural' | 'settings' | 'theme' | 'exit' | 'back' | 'notifications' | 'metrics' | 'optimization' | 'fidelity'>('menu');
    const { profile, updateProfile, recentAchievements, preferences, updatePreferences } = useUser();
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // Check for new achievements or notifications
    useEffect(() => {
        if (preferences.notifications && recentAchievements.length > 0) {
            const latestAchievement = recentAchievements[0];
            setNotificationMessage(`🏆 New Achievement: ${latestAchievement.title}`);
            setShowNotification(true);
            
            // Auto-hide notification after 5 seconds
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [recentAchievements, preferences.notifications]);

    const items: MenuOption[] = [
        {
            label: '💨 Chamber Control (Send Rip)',
            value: 'ri'
        },
        {
            label: '📊 Percolation Monitor',
            value: 'monitor'
        },
        {
            label: '💎 Crystal Analysis',
            value: 'crystal'
        },
        {
            label: '🔍 Diffusion Config',
            value: 'diffusion'
        },
        {
            label: '🍃 Bowl Status',
            value: 'bowl'
        },
        {
            label: '💰 Dab Market',
            value: 'market'
        },
        {
            label: '👥 Friends List',
            value: 'friends'
        },
        {
            label: '🗺️ Route Planner',
            value: 'routes'
        },
        {
            label: '🏆 Achievements',
            value: 'achievements'
        },
        {
            label: '✨ Sensory Experience',
            value: 'sensory'
        },
        {
            label: '🧠 Neural Singularity Ripping',
            value: 'neural'
        },
        {
            label: '💻 RIP-API',
            value: 'ripapi'
        },
        {
            label: '⛓️ Decentralized Ledger',
            value: 'ledger'
        },
        {
            label: '⚖️ Legal Mode',
            value: 'legal'
        },
        {
            label: '🤖 Auto-Carb',
            value: 'autocarb'
        },
        {
            label: '⚙️ Settings',
            value: 'settings'
        },
        {
            label: '❌ Exit',
            value: 'exit'
        }
    ];

    const settingsItems: MenuOption[] = [
        {
            label: `Theme: ${preferences.theme}`,
            value: 'theme'
        },
        {
            label: `Notifications: ${preferences.notifications ? 'ON' : 'OFF'}`,
            value: 'notifications'
        },
        {
            label: `Route Optimization: ${preferences.routeOptimizationLevel}`,
            value: 'optimization'
        },
        {
            label: `Simulation Fidelity: ${preferences.simulationFidelity}`,
            value: 'fidelity'
        },
        {
            label: `Show Metrics: ${preferences.showMetrics ? 'ON' : 'OFF'}`,
            value: 'metrics'
        },
        {
            label: '↩️ Back to Main Menu',
            value: 'back'
        }
    ];

    const handleSelect = (item: MenuOption) => {
        if (item.value === 'exit') {
            process.exit();
        }
        setCurrentScreen(item.value);
    };

    const handleSettingsSelect = (item: MenuOption) => {
        if (item.value === 'back') {
            setCurrentScreen('menu');
            return;
        }
        
        switch (item.value) {
            case 'theme':
                // Cycle through themes
                const themes: Array<'default' | 'dark' | 'psychedelic'> = ['default', 'dark', 'psychedelic'];
                const currentIndex = themes.indexOf(preferences.theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                updatePreferences({ theme: nextTheme });
                break;
                
            case 'notifications':
                updatePreferences({ notifications: !preferences.notifications });
                break;
                
            case 'optimization':
                const levels: Array<'basic' | 'advanced' | 'quantum'> = ['basic', 'advanced', 'quantum'];
                const currentLevel = levels.indexOf(preferences.routeOptimizationLevel);
                const nextLevel = levels[(currentLevel + 1) % levels.length];
                updatePreferences({ routeOptimizationLevel: nextLevel });
                break;
                
            case 'fidelity':
                const fidelities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
                const currentFidelity = fidelities.indexOf(preferences.simulationFidelity);
                const nextFidelity = fidelities[(currentFidelity + 1) % fidelities.length];
                updatePreferences({ simulationFidelity: nextFidelity });
                break;
                
            case 'metrics':
                updatePreferences({ showMetrics: !preferences.showMetrics });
                break;
        }
    };

    const handleReturn = () => {
        setCurrentScreen('menu');
    };

    if (currentScreen === 'ri') {
        return <RipInitiator onReturn={handleReturn} />;
    }

    if (currentScreen === 'monitor') {
        return <SystemMonitor onReturn={handleReturn} />;
    }

    if (currentScreen === 'crystal') {
        return <CrystalAnalyzer onReturn={handleReturn} />;
    }

    if (currentScreen === 'diffusion') {
        return <DiffusionConfig onReturn={handleReturn} />;
    }

    if (currentScreen === 'bowl') {
        return <BowlStatus onReturn={handleReturn} />;
    }

    if (currentScreen === 'market') {
        return <DabMarket 
            onReturn={handleReturn}
            userProfile={profile}
            onUpdateProfile={updateProfile}
        />;
    }

    if (currentScreen === 'friends') {
        return <FriendsList
            onReturn={handleReturn}
            userProfile={profile}
            onUpdateProfile={updateProfile}
        />;
    }

    if (currentScreen === 'routes') {
        return <RoutePlanner onReturn={handleReturn} />;
    }

    if (currentScreen === 'achievements') {
        return <Achievements onReturn={handleReturn} />;
    }

    if (currentScreen === 'sensory') {
        return <SensoryOutput onReturn={handleReturn} />;
    }

    if (currentScreen === 'ripapi') {
        return <RipAPI onReturn={handleReturn} />;
    }

    if (currentScreen === 'ledger') {
        return <DecentralizedLedger onReturn={handleReturn} />;
    }

    if (currentScreen === 'legal') {
        return <LegalMode onReturn={handleReturn} />;
    }

    if (currentScreen === 'autocarb') {
        return <AutoCarb onReturn={() => setCurrentScreen('menu')} />;
    }

    if (currentScreen === 'neural') {
        return <NeuralSingularityRipping onReturn={handleReturn} />;
    }

    if (currentScreen === 'settings') {
        return (
            <Box flexDirection="column" padding={1}>
                <Box marginBottom={1}>
                    <Text bold color="cyan">BROIP SETTINGS</Text>
                </Box>
                
                <Box marginBottom={1}>
                    <Text>Customize your BROIP terminal experience</Text>
                </Box>
                
                <SelectInput 
                    items={settingsItems} 
                    onSelect={handleSettingsSelect} 
                />
            </Box>
        );
    }

    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">BROIP SIMULATION TERMINAL v4.20</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text color="cyan">Welcome to the Bong Rip Over IP Protocol Simulator</Text>
            </Box>

            {showNotification && (
                <Box 
                    marginBottom={1} 
                    borderStyle="round" 
                    borderColor="yellow"
                    paddingX={2}
                    paddingY={1}
                >
                    <Text color="yellow">{notificationMessage}</Text>
                </Box>
            )}

            <Box marginBottom={1} flexDirection="column">
                <Text dimColor>• Configure your virtual glass</Text>
                <Text dimColor>• Monitor real-time percolation metrics</Text>
                <Text dimColor>• Analyze crystal formations</Text>
                <Text dimColor>• Track bowl status and performance</Text>
                <Text dimColor>• Plan optimal smoke delivery routes</Text>
            </Box>

            <Box marginBottom={1} flexDirection="column" borderStyle="single" paddingX={2} paddingY={1}>
                <Text bold color="yellow">User Profile: {profile.username}</Text>
                <Text>DabCoins: <Text color="green">{profile.dabCoins.toFixed(2)} DC</Text></Text>
                <Text>Inventory: <Text color="cyan">{profile.inventory.length} items</Text></Text>
                <Text>Friends: <Text color="magenta">{profile.friends.length} online</Text></Text>
                
                {preferences.showMetrics && (
                    <Box marginTop={1} flexDirection="column">
                        <Text bold>BROIP Stats:</Text>
                        <Text>Total Dabs: {profile.stats.totalDabs}</Text>
                        <Text>Routes Created: {profile.stats.routesCreated}</Text>
                        <Text>Highest Reliability: {profile.stats.highestReliabilityRoute.toFixed(1)}%</Text>
                    </Box>
                )}
                
                {recentAchievements.length > 0 && (
                    <Box marginTop={1}>
                        <Text>Recent Achievement: </Text>
                        <Text color="yellow">{recentAchievements[0].icon} {recentAchievements[0].title}</Text>
                    </Box>
                )}
            </Box>

            <SelectInput items={items} onSelect={handleSelect} />
        </Box>
    );
};

export default MainMenu;

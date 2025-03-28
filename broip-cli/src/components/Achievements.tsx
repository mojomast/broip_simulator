import React from 'react';
import { Box, Text } from './common';
import { useUser, Achievement } from '../utils/UserContext';

interface AchievementsProps {
    onReturn: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onReturn }) => {
    const { recentAchievements, profile } = useUser();
    
    const getAchievementTypeColor = (type: string): string => {
        switch (type) {
            case 'routes': return 'green';
            case 'dabs': return 'yellow';
            case 'system': return 'blue';
            case 'social': return 'magenta';
            default: return 'white';
        }
    };
    
    const getDefaultAchievements = (): Achievement[] => {
        const achievements: Achievement[] = [];
        
        // Check route-related achievements
        if (profile.stats.routesCreated >= 1) {
            achievements.push({
                id: 'default-route-1',
                title: 'First Connection',
                description: 'Created your first BROIP route',
                timestamp: new Date(),
                type: 'routes',
                icon: '🔌'
            });
        }
        
        if (profile.stats.routesOptimized >= 1) {
            achievements.push({
                id: 'default-route-2',
                title: 'Efficiency Expert',
                description: 'Optimized a BROIP route',
                timestamp: new Date(),
                type: 'routes',
                icon: '⚡'
            });
        }
        
        if (profile.stats.highestReliabilityRoute > 90) {
            achievements.push({
                id: 'default-route-3',
                title: 'Reliable Ripper',
                description: 'Created a route with over 90% reliability',
                timestamp: new Date(),
                type: 'routes',
                icon: '🏆'
            });
        }
        
        // Dab-related achievements
        if (profile.stats.totalDabs >= 10) {
            achievements.push({
                id: 'default-dab-1',
                title: 'Cloud Chaser',
                description: 'Completed 10 dabs',
                timestamp: new Date(),
                type: 'dabs',
                icon: '☁️'
            });
        }
        
        if (profile.stats.perfectDabs >= 1) {
            achievements.push({
                id: 'default-dab-2',
                title: 'Perfect Timing',
                description: 'Achieved a perfect dab',
                timestamp: new Date(),
                type: 'dabs',
                icon: '💯'
            });
        }
        
        if (profile.dabCoins > 5000) {
            achievements.push({
                id: 'default-system-1',
                title: 'BROIP Investor',
                description: 'Amassed over 5000 DabCoins',
                timestamp: new Date(),
                type: 'system',
                icon: '💰'
            });
        }
        
        if (profile.stats.dabsShared >= 5) {
            achievements.push({
                id: 'default-social-1',
                title: 'Sharing is Caring',
                description: 'Shared dabs with friends 5 times',
                timestamp: new Date(),
                type: 'social',
                icon: '🤝'
            });
        }
        
        return achievements;
    };
    
    // Combine recent and default achievements
    const allAchievements = [...recentAchievements, ...getDefaultAchievements()];
    
    // Remove duplicates based on id
    const uniqueAchievements = allAchievements.filter((achievement, index, self) =>
        index === self.findIndex(a => a.id === achievement.id)
    );
    
    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">BROIP ACHIEVEMENTS</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Track your progress in mastering the BROIP protocol</Text>
            </Box>
            
            {uniqueAchievements.length === 0 ? (
                <Box marginY={2}>
                    <Text color="yellow">No achievements yet. Start using BROIP features to earn them!</Text>
                </Box>
            ) : (
                <Box flexDirection="column" marginY={1}>
                    {uniqueAchievements.map((achievement, index) => (
                        <Box 
                            key={index} 
                            marginBottom={1} 
                            paddingX={1}
                            paddingY={1}
                            borderStyle="single"
                        >
                            <Box flexDirection="column">
                                <Box>
                                    <Text>{achievement.icon} </Text>
                                    <Text bold color={getAchievementTypeColor(achievement.type)}>
                                        {achievement.title}
                                    </Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text>{achievement.description}</Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text dimColor>
                                        {achievement.timestamp.toLocaleDateString()} • {achievement.type.toUpperCase()}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
            
            <Box marginTop={2}>
                <Text 
                    backgroundColor="blue" 
                    color="white" 
                    paddingX={2}
                    paddingY={1}
                    onPress={onReturn}
                >
                    Return to Menu
                </Text>
            </Box>
        </Box>
    );
};

export default Achievements;

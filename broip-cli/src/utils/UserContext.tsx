import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserProfile } from './marketTypes';
import { Route } from './routeTypes';

interface UserContextType {
    profile: UserProfile;
    updateProfile: (newProfile: UserProfile) => void;
    savedRoutes: Route[];
    saveRoute: (route: Route) => void;
    deleteRoute: (routeId: string) => void;
    recentAchievements: Achievement[];
    addAchievement: (achievement: Achievement) => void;
    preferences: UserPreferences;
    updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    timestamp: Date;
    type: 'routes' | 'dabs' | 'system' | 'social';
    icon: string;
}

export interface UserPreferences {
    theme: 'default' | 'dark' | 'psychedelic';
    notifications: boolean;
    routeOptimizationLevel: 'basic' | 'advanced' | 'quantum';
    defaultRipDuration: number;
    simulationFidelity: 'low' | 'medium' | 'high';
    showMetrics: boolean;
}

const defaultProfile: UserProfile = {
    id: '1',
    username: 'DabMaster420',
    dabCoins: 1000,
    inventory: [],
    friends: [],
    stats: {
        totalDabs: 0,
        dabsShared: 0,
        profitMade: 0,
        rareDabsFound: 0,
        perfectDabs: 0,
        routesCreated: 0,
        routesOptimized: 0,
        highestReliabilityRoute: 0
    }
};

const defaultPreferences: UserPreferences = {
    theme: 'default',
    notifications: true,
    routeOptimizationLevel: 'basic',
    defaultRipDuration: 3,
    simulationFidelity: 'medium',
    showMetrics: true
};

const UserContext = createContext<UserContextType>({
    profile: defaultProfile,
    updateProfile: () => {},
    savedRoutes: [],
    saveRoute: () => {},
    deleteRoute: () => {},
    recentAchievements: [],
    addAchievement: () => {},
    preferences: defaultPreferences,
    updatePreferences: () => {}
});

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
    const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

    // Update user profile
    const updateProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
        // Here you could persist to localStorage or a backend
    };

    // Save a route to the user's collection
    const saveRoute = (route: Route) => {
        // Check if the route already exists to avoid duplicates
        if (!savedRoutes.some(r => r.id === route.id)) {
            const newRoutes = [...savedRoutes, route];
            setSavedRoutes(newRoutes);
            
            // Update stats
            const newProfile = {
                ...profile,
                stats: {
                    ...profile.stats,
                    routesCreated: profile.stats.routesCreated + 1,
                    highestReliabilityRoute: Math.max(
                        profile.stats.highestReliabilityRoute, 
                        route.metrics.reliability
                    )
                }
            };
            
            updateProfile(newProfile);
            
            // Check for achievements
            if (newRoutes.length === 5) {
                addAchievement({
                    id: Math.random().toString(36).substr(2, 9),
                    title: 'Route Master',
                    description: 'Created 5 successful routes',
                    timestamp: new Date(),
                    type: 'routes',
                    icon: '🗺️'
                });
            }
            
            if (route.metrics.reliability > 95) {
                addAchievement({
                    id: Math.random().toString(36).substr(2, 9),
                    title: 'Six Sigma Ripper',
                    description: 'Created a route with over 95% reliability',
                    timestamp: new Date(),
                    type: 'routes',
                    icon: '⭐'
                });
            }
        }
    };

    // Delete a route from the user's collection
    const deleteRoute = (routeId: string) => {
        setSavedRoutes(savedRoutes.filter(route => route.id !== routeId));
    };

    // Add a new achievement
    const addAchievement = (achievement: Achievement) => {
        setRecentAchievements(prev => [achievement, ...prev].slice(0, 10)); // Keep only 10 most recent
    };

    // Update user preferences
    const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
        setPreferences(prev => ({
            ...prev,
            ...newPreferences
        }));
    };

    return (
        <UserContext.Provider value={{ 
            profile, 
            updateProfile,
            savedRoutes,
            saveRoute,
            deleteRoute,
            recentAchievements,
            addAchievement,
            preferences,
            updatePreferences
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

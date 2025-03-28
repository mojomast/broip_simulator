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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = exports.UserProvider = void 0;
const react_1 = __importStar(require("react"));
const defaultProfile = {
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
const defaultPreferences = {
    theme: 'default',
    notifications: true,
    routeOptimizationLevel: 'basic',
    defaultRipDuration: 3,
    simulationFidelity: 'medium',
    showMetrics: true
};
const UserContext = (0, react_1.createContext)({
    profile: defaultProfile,
    updateProfile: () => { },
    savedRoutes: [],
    saveRoute: () => { },
    deleteRoute: () => { },
    recentAchievements: [],
    addAchievement: () => { },
    preferences: defaultPreferences,
    updatePreferences: () => { }
});
const UserProvider = ({ children }) => {
    const [profile, setProfile] = (0, react_1.useState)(defaultProfile);
    const [savedRoutes, setSavedRoutes] = (0, react_1.useState)([]);
    const [recentAchievements, setRecentAchievements] = (0, react_1.useState)([]);
    const [preferences, setPreferences] = (0, react_1.useState)(defaultPreferences);
    // Update user profile
    const updateProfile = (newProfile) => {
        setProfile(newProfile);
        // Here you could persist to localStorage or a backend
    };
    // Save a route to the user's collection
    const saveRoute = (route) => {
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
                    highestReliabilityRoute: Math.max(profile.stats.highestReliabilityRoute, route.metrics.reliability)
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
    const deleteRoute = (routeId) => {
        setSavedRoutes(savedRoutes.filter(route => route.id !== routeId));
    };
    // Add a new achievement
    const addAchievement = (achievement) => {
        setRecentAchievements(prev => [achievement, ...prev].slice(0, 10)); // Keep only 10 most recent
    };
    // Update user preferences
    const updatePreferences = (newPreferences) => {
        setPreferences(prev => ({
            ...prev,
            ...newPreferences
        }));
    };
    return (react_1.default.createElement(UserContext.Provider, { value: {
            profile,
            updateProfile,
            savedRoutes,
            saveRoute,
            deleteRoute,
            recentAchievements,
            addAchievement,
            preferences,
            updatePreferences
        } }, children));
};
exports.UserProvider = UserProvider;
const useUser = () => (0, react_1.useContext)(UserContext);
exports.useUser = useUser;

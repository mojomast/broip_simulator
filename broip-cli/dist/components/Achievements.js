"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const UserContext_1 = require("../utils/UserContext");
const Achievements = ({ onReturn }) => {
    const { recentAchievements, profile } = (0, UserContext_1.useUser)();
    const getAchievementTypeColor = (type) => {
        switch (type) {
            case 'routes': return 'green';
            case 'dabs': return 'yellow';
            case 'system': return 'blue';
            case 'social': return 'magenta';
            default: return 'white';
        }
    };
    const getDefaultAchievements = () => {
        const achievements = [];
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
    const uniqueAchievements = allAchievements.filter((achievement, index, self) => index === self.findIndex(a => a.id === achievement.id));
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP ACHIEVEMENTS")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Track your progress in mastering the BROIP protocol")),
        uniqueAchievements.length === 0 ? (react_1.default.createElement(ink_1.Box, { marginY: 2 },
            react_1.default.createElement(ink_1.Text, { color: "yellow" }, "No achievements yet. Start using BROIP features to earn them!"))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 }, uniqueAchievements.map((achievement, index) => (react_1.default.createElement(ink_1.Box, { key: index, marginBottom: 1, paddingX: 1, paddingY: 1, borderStyle: "single" },
            react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, null,
                        achievement.icon,
                        " "),
                    react_1.default.createElement(ink_1.Text, { bold: true, color: getAchievementTypeColor(achievement.type) }, achievement.title)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null, achievement.description)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, { dimColor: true },
                        achievement.timestamp.toLocaleDateString(),
                        " \u2022 ",
                        achievement.type.toUpperCase())))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Text, { backgroundColor: "blue", color: "white", paddingX: 2, paddingY: 1, onPress: onReturn }, "Return to Menu"))));
};
exports.default = Achievements;

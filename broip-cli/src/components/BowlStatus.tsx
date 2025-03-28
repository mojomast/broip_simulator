import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { BowlStats, RipPacket } from '../utils/broipTypes';

interface BowlStatusProps {
    onReturn: () => void;
}

const BowlStatus: React.FC<BowlStatusProps> = ({ onReturn }) => {
    const [stats, setStats] = useState<BowlStats>({
        totalRips: 0,
        avgMilkDensity: 0,
        peakPercolation: 0,
        crystalRating: 0,
        uptime: 0
    });
    const [recentRips, setRecentRips] = useState<RipPacket[]>([]);
    const [waitingForReturn, setWaitingForReturn] = useState(false);

    useInput((input) => {
        if (waitingForReturn || input.toLowerCase() === 'x') {
            onReturn();
        }
    });

    useEffect(() => {
        // Simulate receiving rip packets
        const interval = setInterval(() => {
            const newRip: RipPacket = {
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toISOString(),
                milkDensity: Math.random() * 100,
                crystalPurity: Math.random() * 100,
                percolationRate: Math.random() * 50 + 20,
                bowlStatus: Math.random() > 0.7 ? 'CACHED' : Math.random() > 0.5 ? 'PARTIALLY_CACHED' : 'FRESH',
                chamberTemp: Math.random() * 30 + 20
            };

            setRecentRips(prev => [...prev.slice(-4), newRip]);
            
            setStats(prev => ({
                totalRips: prev.totalRips + 1,
                avgMilkDensity: (prev.avgMilkDensity * prev.totalRips + newRip.milkDensity) / (prev.totalRips + 1),
                peakPercolation: Math.max(prev.peakPercolation, newRip.percolationRate),
                crystalRating: (prev.crystalRating + newRip.crystalPurity) / 2,
                uptime: prev.uptime + 1
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'FRESH': return 'green';
            case 'PARTIALLY_CACHED': return 'yellow';
            case 'CACHED': return 'red';
            default: return 'white';
        }
    };

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="green">BROIP BOWL STATUS MONITOR v4.20</Text>

            <Box flexDirection="column" marginY={1}>
                <Text bold>Global Statistics:</Text>
                <Box marginLeft={2} flexDirection="column">
                    <Text>Total Rips Processed: <Text color="yellow">{stats.totalRips}</Text></Text>
                    <Text>Average Milk Density: <Text color="yellow">{stats.avgMilkDensity.toFixed(2)}%</Text></Text>
                    <Text>Peak Percolation Rate: <Text color="yellow">{stats.peakPercolation.toFixed(2)} bps</Text></Text>
                    <Text>Crystal Quality Index: <Text color="yellow">{stats.crystalRating.toFixed(2)}%</Text></Text>
                    <Text>System Uptime: <Text color="yellow">{stats.uptime}s</Text></Text>
                </Box>
            </Box>

            <Box flexDirection="column" marginY={1}>
                <Text bold>Recent Rip Activity:</Text>
                <Box marginLeft={2} flexDirection="column">
                    {recentRips.map((rip, i) => (
                        <Box key={i} flexDirection="column" marginY={1}>
                            <Text dimColor>ID: {rip.id} • {new Date(rip.timestamp).toLocaleTimeString()}</Text>
                            <Box marginLeft={2} flexDirection="column">
                                <Text>Bowl Status: <Text color={getStatusColor(rip.bowlStatus)}>{rip.bowlStatus}</Text></Text>
                                <Text>Milk Density: <Text color="yellow">{rip.milkDensity.toFixed(2)}%</Text></Text>
                                <Text>Percolation Rate: <Text color="yellow">{rip.percolationRate.toFixed(2)} bps</Text></Text>
                                <Text>Chamber Temp: <Text color="yellow">{rip.chamberTemp.toFixed(1)}°C</Text></Text>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box marginTop={1}>
                <Text color="green"><Spinner type="dots"/></Text>
                <Text> Monitoring bowl status... Press 'x' to return</Text>
            </Box>
        </Box>
    );
};

export default BowlStatus;

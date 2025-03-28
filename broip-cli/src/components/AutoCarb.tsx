import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useUser } from '../utils/UserContext';

interface AutoCarbProps {
    onReturn: () => void;
}

interface SensorData {
    thcLevel: number;
    userVitalSigns: {
        heartRate: number;
        breathingRate: number;
    };
}

const AutoCarb: React.FC<AutoCarbProps> = ({ onReturn }) => {
    const { preferences } = useUser();
    const [autoCarbEnabled, setAutoCarbEnabled] = useState(true);
    const [sensorData, setSensorData] = useState<SensorData>({
        thcLevel: 0,
        userVitalSigns: {
            heartRate: 60,
            breathingRate: 12,
        }
    });
    const [carbLevel, setCarbLevel] = useState(50);

    // Simulate sensor data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setSensorData(prev => ({
                thcLevel: Math.min(100, prev.thcLevel + Math.random() * 5),
                userVitalSigns: {
                    heartRate: Math.max(50, Math.min(120, prev.userVitalSigns.heartRate + (Math.random() - 0.5) * 10)),
                    breathingRate: Math.max(8, Math.min(20, prev.userVitalSigns.breathingRate + (Math.random() - 0.5) * 4)),
                }
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Adjust carb level based on sensor data
    useEffect(() => {
        let newCarbLevel = 50;

        // Example logic: adjust carb level based on THC and heart rate
        if (sensorData.thcLevel > 70 && sensorData.userVitalSigns.heartRate > 90) {
            newCarbLevel = 20; // Reduce carb to mitigate potential over-intoxication
        } else if (sensorData.thcLevel < 30 && sensorData.userVitalSigns.heartRate < 70) {
            newCarbLevel = 80; // Increase carb to enhance the experience
        }

        setCarbLevel(newCarbLevel);
    }, [sensorData]);

    const toggleAutoCarb = () => {
        setAutoCarbEnabled(!autoCarbEnabled);
    };

    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">AI-Powered Auto-Carb</Text>
            </Box>
            <Box marginBottom={1}>
                <Text>Intelligently adjusts carb level for optimal user safety and experience</Text>
            </Box>
            <Box borderStyle="single" padding={1} marginBottom={1}>
                <Text>Auto-Carb: {autoCarbEnabled ? <Text color="green">Enabled</Text> : <Text color="red">Disabled</Text>}</Text>
                <Text>Current Carb Level: <Text color="yellow">{carbLevel}%</Text></Text>
                <Text>THC Level: {sensorData.thcLevel.toFixed(1)}</Text>
                <Text>Heart Rate: {sensorData.userVitalSigns.heartRate.toFixed(0)} bpm</Text>
                <Text>Breathing Rate: {sensorData.userVitalSigns.breathingRate.toFixed(0)} breaths/min</Text>
            </Box>
            <Box>
                <Text onPress={toggleAutoCarb}>Toggle Auto-Carb</Text>
            </Box>
            <Box marginTop={2}>
                <Text onPress={onReturn}>Return to Main Menu</Text>
            </Box>
        </Box>
    );
};

export default AutoCarb;

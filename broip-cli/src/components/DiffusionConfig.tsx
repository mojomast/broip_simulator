import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { DiffusionConfig as DiffusionConfigType, PercolationType } from '../utils/broipTypes';

interface DiffusionConfigProps {
    onReturn: () => void;
}

const DiffusionConfig: React.FC<DiffusionConfigProps> = ({ onReturn }) => {
    const [config, setConfig] = useState<DiffusionConfigType>({
        percolationType: 'SINGLE',
        waterLevel: 50,
        iceNotches: 3,
        dragCoefficient: 1.0
    });

    const [selectedOption, setSelectedOption] = useState<string>('type');
    const [waitingForReturn, setWaitingForReturn] = useState(false);

    useInput((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }

        if (input.toLowerCase() === 'x') {
            setWaitingForReturn(true);
            return;
        }

        if (selectedOption !== 'type') {
            if (key.leftArrow) {
                adjustValue(selectedOption, -1);
            } else if (key.rightArrow) {
                adjustValue(selectedOption, 1);
            }
        }
    });

    const adjustValue = (option: string, delta: number) => {
        setConfig(prev => {
            switch(option) {
                case 'water':
                    return { ...prev, waterLevel: Math.max(0, Math.min(100, prev.waterLevel + delta * 5)) };
                case 'ice':
                    return { ...prev, iceNotches: Math.max(0, Math.min(6, prev.iceNotches + delta)) };
                case 'drag':
                    return { ...prev, dragCoefficient: Math.max(0.1, Math.min(2.0, prev.dragCoefficient + delta * 0.1)) };
                default:
                    return prev;
            }
        });
    };

    const percolationTypes: {label: string, value: PercolationType}[] = [
        { label: 'Single Perc', value: 'SINGLE' },
        { label: 'Double Perc', value: 'DOUBLE' },
        { label: 'Triple Perc', value: 'TRIPLE' },
        { label: 'Honeycomb', value: 'HONEYCOMB' },
        { label: 'Tree Perc', value: 'TREE' },
        { label: 'Matrix', value: 'MATRIX' }
    ];

    const handlePercolationSelect = (item: {value: PercolationType}) => {
        setConfig(prev => ({ ...prev, percolationType: item.value }));
        setSelectedOption('water');
    };

    const renderBar = (value: number, max: number) => {
        const width = 20;
        const filled = Math.floor((value / max) * width);
        return `[${'|'.repeat(filled)}${'-'.repeat(width - filled)}]`;
    };

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="green">BROIP DIFFUSION CONFIGURATION v4.20</Text>

            {selectedOption === 'type' ? (
                <Box flexDirection="column" marginY={1}>
                    <Text bold color="yellow">Select Percolation Type:</Text>
                    <SelectInput items={percolationTypes} onSelect={handlePercolationSelect} />
                </Box>
            ) : (
                <Box flexDirection="column" marginY={1}>
                    <Text bold>Current Configuration:</Text>
                    <Box marginY={1} flexDirection="column">
                        <Text>Percolation Type: <Text color="green">{config.percolationType}</Text></Text>
                        
                        <Box marginY={1}>
                            <Text>Water Level: </Text>
                            <Text color={selectedOption === 'water' ? 'yellow' : 'cyan'}>
                                {renderBar(config.waterLevel, 100)} {config.waterLevel}%
                            </Text>
                        </Box>

                        <Box marginY={1}>
                            <Text>Ice Notches: </Text>
                            <Text color={selectedOption === 'ice' ? 'yellow' : 'cyan'}>
                                {renderBar(config.iceNotches, 6)} {config.iceNotches}/6
                            </Text>
                        </Box>

                        <Box marginY={1}>
                            <Text>Drag Coefficient: </Text>
                            <Text color={selectedOption === 'drag' ? 'yellow' : 'cyan'}>
                                {renderBar(config.dragCoefficient, 2)} {config.dragCoefficient.toFixed(1)}
                            </Text>
                        </Box>
                    </Box>

                    <Box marginY={1}>
                        <Text color="cyan">Use ← → arrows to adjust values • Space to cycle options • X to finish</Text>
                    </Box>

                    {waitingForReturn && (
                        <Box marginY={1}>
                            <Text color="yellow">Configuration saved! Press any key to return to menu</Text>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default DiffusionConfig;

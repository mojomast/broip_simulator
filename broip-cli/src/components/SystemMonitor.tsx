import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import {
    generateTechnicalPhrase,
    generateErrorMessage,
    getRandomLoadingPhrase,
    shouldErrorResolve
} from '../utils/technobabble';

interface SystemMonitorProps {
    onReturn: () => void;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ onReturn }) => {
    const [status, setStatus] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [inputBuffer, setInputBuffer] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [waitingForReturn, setWaitingForReturn] = useState(false);

    useInput((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }

        if (input.toLowerCase() === 'x' && isActive) {
            setIsActive(false);
            setError('PERCOLATION_MANUALLY_TERMINATED');
            addStatus('EMERGENCY CHAMBER CLEAR ACTIVATED');
            setWaitingForReturn(true);
            return;
        }

        if (waitingForInput && isActive) {
            if (key.return) {
                handleErrorResolution();
            } else {
                setInputBuffer(prev => prev + input);
            }
        }
    });

    const handleErrorResolution = () => {
        setWaitingForInput(false);
        if (shouldErrorResolve()) {
            addStatus('CHAMBER_CLEARED: Manual override accepted');
            setError(null);
        } else {
            addStatus('BLOCKAGE_PERSISTS: Override rejected - chamber contamination detected');
            setTimeout(triggerRandomError, 2000);
        }
        setInputBuffer('');
    };

    const addStatus = (message: string) => {
        setStatus(prev => [...prev.slice(-8), message]);
    };

    const triggerRandomError = () => {
        if (!isActive) return;
        const errorMsg = generateErrorMessage();
        setError(errorMsg);
        addStatus(`PERCOLATION_ALERT: ${errorMsg}`);
        setWaitingForInput(true);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!error && isActive) {
                addStatus(generateTechnicalPhrase());
                if (Math.random() < 0.2) {
                    triggerRandomError();
                }
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [error, isActive]);

    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">{'['}<Text color="yellow">BROIP PERCOLATION MONITOR v4.20</Text>{']'}</Text>
            </Box>
            
            {status.map((line, i) => (
                <Box key={i}>
                    <Text color="green">[{new Date().toISOString()}] </Text>
                    <Text color="cyan">{line}</Text>
                </Box>
            ))}
            
            {error && (
                <Box flexDirection="column" marginTop={1}>
                    <Text color="red" bold>
                        {`>>> PERCOLATION ERROR: ${error}`}
                    </Text>
                    <Text color="yellow">
                        {waitingForInput && !waitingForReturn ? (
                            <>MANUAL CLEAR REQUIRED - Enter chamber reset code: {inputBuffer}_</>
                        ) : (
                            <>Analyzing blockage vectors...</>
                        )}
                    </Text>
                </Box>
            )}
            
            <Box marginTop={1}>
                <Text color="green"><Spinner type="dots" /></Text>
                <Text> {getRandomLoadingPhrase()}</Text>
            </Box>

            <Box marginTop={1}>
                <Text color={waitingForReturn ? "yellow" : "cyan"}>
                    {waitingForReturn ? "Press any key to return to menu" : "Press 'x' to emergency clear"}
                </Text>
            </Box>
        </Box>
    );
};

export default SystemMonitor;

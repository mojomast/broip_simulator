import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { generateTechnicalPhrase, generateErrorMessage, shouldErrorResolve } from '../utils/technobabble';

interface RipInitiatorProps {
    onReturn: () => void;
}

const RipInitiator: React.FC<RipInitiatorProps> = ({ onReturn }) => {
    const [ripState, setRipState] = useState<string>('CHAMBER_READY');
    const [subProcess, setSubProcess] = useState<string>('');
    const [errorState, setErrorState] = useState<string | null>(null);
    const [userInput, setUserInput] = useState<string>('');
    const [requiresInput, setRequiresInput] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [waitingForReturn, setWaitingForReturn] = useState(false);

    useInput((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }

        if (input.toLowerCase() === 'x' && isActive) {
            setIsActive(false);
            setRipState('CHAMBER_CLEARED');
            setErrorState('MANUAL_CLEAR_ACTIVATED');
            setWaitingForReturn(true);
            return;
        }

        if (requiresInput && isActive) {
            if (key.return) {
                handleUserInput();
            } else {
                setUserInput(prev => prev + input);
            }
        }
    });

    const handleUserInput = () => {
        setRequiresInput(false);
        if (shouldErrorResolve()) {
            setErrorState(null);
            setRipState('REPACKING_BOWL');
            setProgress(0);
        } else {
            const newError = generateErrorMessage();
            setErrorState(newError);
            setRipState('RIP_FAILED');
            setUserInput('');
            setTimeout(() => setRequiresInput(true), 2000);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!errorState && isActive) {
                setSubProcess(generateTechnicalPhrase());
                setProgress(prev => {
                    const next = prev + Math.random() * 10;
                    if (next >= 100) {
                        if (Math.random() < 0.3) {
                            setErrorState(generateErrorMessage());
                            setRequiresInput(true);
                            return 0;
                        }
                        return 0;
                    }
                    return next;
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [errorState, isActive]);

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="green">BROIP CHAMBER CONTROL v4.20</Text>
            <Box marginY={1}>
                <Text color="green"><Spinner type="dots" /></Text>
                <Text> Chamber Status: {ripState}</Text>
            </Box>
            <Text color="yellow">Milk Level: [{'\u2588'.repeat(Math.floor(progress/5))}{'_'.repeat(20-Math.floor(progress/5))}] {Math.floor(progress)}%</Text>
            <Text dimColor>{subProcess}</Text>
            
            {errorState && (
                <Box flexDirection="column" marginTop={1}>
                    <Text color="red" bold>
                        {`!!! CHAMBER ALERT: ${errorState}`}
                    </Text>
                    {requiresInput && !waitingForReturn && (
                        <Text color="yellow">
                            Enter emergency clear sequence: {userInput}_
                        </Text>
                    )}
                </Box>
            )}
            
            <Box marginTop={1}>
                <Text color={waitingForReturn ? "yellow" : "cyan"}>
                    {waitingForReturn ? "Press any key to return to menu" : "Press 'x' to clear chamber"}
                </Text>
            </Box>
        </Box>
    );
};

export default RipInitiator;

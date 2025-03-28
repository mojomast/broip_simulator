import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { CrystalAnalysis } from '../utils/broipTypes';
import { generateTechnicalPhrase } from '../utils/technobabble';

interface CrystalAnalyzerProps {
    onReturn: () => void;
}

const CrystalAnalyzer: React.FC<CrystalAnalyzerProps> = ({ onReturn }) => {
    const [analyzing, setAnalyzing] = useState(true);
    const [waitingForReturn, setWaitingForReturn] = useState(false);
    const [analysis, setAnalysis] = useState<CrystalAnalysis | null>(null);
    const [scanPhase, setScanPhase] = useState(0);

    useInput((input, key) => {
        if (waitingForReturn) {
            onReturn();
            return;
        }

        if (input.toLowerCase() === 'x') {
            setWaitingForReturn(true);
        }
    });

    useEffect(() => {
        if (!analyzing) return;

        const interval = setInterval(() => {
            setScanPhase(prev => {
                if (prev >= 100) {
                    setAnalyzing(false);
                    clearInterval(interval);
                    setAnalysis({
                        density: Math.random() * 100,
                        clarity: Math.random() * 100,
                        structure: ['INDICA_DOMINANT', 'SATIVA_DOMINANT', 'HYBRID_BALANCED'][Math.floor(Math.random() * 3)],
                        potency: Math.random() * 100,
                        recommendation: [
                            'OPTIMAL FOR IMMEDIATE CONSUMPTION',
                            'REQUIRES ADDITIONAL CURING',
                            'PEAK CRYSTALLIZATION ACHIEVED',
                            'RECOMMEND HUMIDITY ADJUSTMENT'
                        ][Math.floor(Math.random() * 4)]
                    });
                    return prev;
                }
                return prev + 10;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [analyzing]);

    const getPhaseText = () => {
        const phases = [
            'INITIALIZING CRYSTAL MATRIX',
            'CALIBRATING TRICHOME SENSORS',
            'ANALYZING MOLECULAR STRUCTURE',
            'CALCULATING DENSITY RATIOS',
            'MEASURING POTENCY VECTORS',
            'EVALUATING TERPENE PROFILES',
            'PROCESSING CRYSTALLIZATION PATTERNS',
            'GENERATING RECOMMENDATIONS',
            'FINALIZING ANALYSIS',
            'COMPILING RESULTS'
        ];
        return phases[Math.floor(scanPhase / 10)];
    };

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="green">BROIP CRYSTAL ANALYSIS MATRIX v4.20</Text>
            
            {analyzing ? (
                <>
                    <Box marginY={1}>
                        <Text color="green"><Spinner type="dots"/></Text>
                        <Text> {getPhaseText()}</Text>
                    </Box>
                    <Text color="yellow">
                        Analysis Progress: [{'\u2588'.repeat(Math.floor(scanPhase/5))}{'_'.repeat(20-Math.floor(scanPhase/5))}] {scanPhase}%
                    </Text>
                    <Text dimColor>{generateTechnicalPhrase()}</Text>
                </>
            ) : analysis && (
                <Box flexDirection="column" marginY={1}>
                    <Text color="cyan">{'='.repeat(50)}</Text>
                    <Text bold>CRYSTAL ANALYSIS REPORT</Text>
                    <Text color="cyan">{'='.repeat(50)}</Text>
                    
                    <Box marginY={1} flexDirection="column">
                        <Text>Density Rating: <Text color="yellow">{analysis.density.toFixed(2)}%</Text></Text>
                        <Text>Crystal Clarity: <Text color="yellow">{analysis.clarity.toFixed(2)}%</Text></Text>
                        <Text>Structure Type: <Text color="green">{analysis.structure}</Text></Text>
                        <Text>Potency Index: <Text color="yellow">{analysis.potency.toFixed(2)}%</Text></Text>
                        
                        <Box marginY={1}>
                            <Text bold color="cyan">RECOMMENDATION: </Text>
                            <Text color="yellow">{analysis.recommendation}</Text>
                        </Box>
                    </Box>
                </Box>
            )}

            <Box marginTop={1}>
                <Text color={waitingForReturn ? "yellow" : "cyan"}>
                    {waitingForReturn ? 
                        "Press any key to return to menu" : 
                        analyzing ? 
                            "Analysis in progress..." : 
                            "Press 'x' to return to menu"}
                </Text>
            </Box>
        </Box>
    );
};

export default CrystalAnalyzer;

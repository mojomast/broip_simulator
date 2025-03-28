import React, { useState, useEffect } from 'react';
import { Box, Text } from './common';
import { useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface DecentralizedLedgerProps {
    onReturn: () => void;
}

interface StrainRecord {
    id: string;
    name: string;
    origin: string;
    contributorId: string;
    contributorAlias: string;
    thcContent: number;
    cbdContent: number;
    terpeneProfile: Record<string, number>;
    verificationStatus: 'VERIFIED' | 'PENDING' | 'DISPUTED';
    blockHeight: number;
    timestamp: string;
    transactionHash: string;
    totalRips: number;
}

interface Contributor {
    id: string;
    alias: string;
    trustScore: number;
    totalContributions: number;
    joinDate: string;
    lastActive: string;
    verifiedContributions: number;
}

const DecentralizedLedger: React.FC<DecentralizedLedgerProps> = ({ onReturn }) => {
    const { preferences } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'STRAINS' | 'CONTRIBUTORS' | 'MINE' | 'VERIFY'>('MENU');
    const [selectedStrainId, setSelectedStrainId] = useState<string | null>(null);
    const [selectedContributorId, setSelectedContributorId] = useState<string | null>(null);
    const [isMining, setIsMining] = useState(false);
    const [miningProgress, setMiningProgress] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    
    // Sample data
    const [strainRecords, setStrainRecords] = useState<StrainRecord[]>([
        {
            id: 'strain1',
            name: 'Blue Dream',
            origin: 'California, USA',
            contributorId: 'contrib1',
            contributorAlias: 'TerpeneWizard',
            thcContent: 18.5,
            cbdContent: 0.2,
            terpeneProfile: {
                myrcene: 0.45,
                pinene: 0.22,
                limonene: 0.18,
                caryophyllene: 0.10
            },
            verificationStatus: 'VERIFIED',
            blockHeight: 234582,
            timestamp: '2023-09-14T14:23:16Z',
            transactionHash: '0x7c2b230c9ac3a0e1a9d5c7d18f6b84f36715fad203c0fd7b0a7648b3f6c4a7d2',
            totalRips: 2145
        },
        {
            id: 'strain2',
            name: 'Northern Lights',
            origin: 'Amsterdam, Netherlands',
            contributorId: 'contrib2',
            contributorAlias: 'CannaCollector',
            thcContent: 16.2,
            cbdContent: 0.1,
            terpeneProfile: {
                myrcene: 0.32,
                pinene: 0.15,
                limonene: 0.08,
                linalool: 0.12
            },
            verificationStatus: 'VERIFIED',
            blockHeight: 234490,
            timestamp: '2023-09-12T09:17:42Z',
            transactionHash: '0x3a9d8b7c6e5f4d3c2b1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8',
            totalRips: 1874
        },
        {
            id: 'strain3',
            name: 'OG Kush',
            origin: 'Los Angeles, USA',
            contributorId: 'contrib3',
            contributorAlias: 'KushKing420',
            thcContent: 22.1,
            cbdContent: 0.3,
            terpeneProfile: {
                myrcene: 0.28,
                limonene: 0.25,
                caryophyllene: 0.15,
                humulene: 0.09
            },
            verificationStatus: 'PENDING',
            blockHeight: 234601,
            timestamp: '2023-09-15T10:45:33Z',
            transactionHash: '0xd1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0',
            totalRips: 1532
        }
    ]);
    
    const [contributors, setContributors] = useState<Contributor[]>([
        {
            id: 'contrib1',
            alias: 'TerpeneWizard',
            trustScore: 97,
            totalContributions: 42,
            joinDate: '2023-01-15T00:00:00Z',
            lastActive: '2023-09-16T12:34:21Z',
            verifiedContributions: 39
        },
        {
            id: 'contrib2',
            alias: 'CannaCollector',
            trustScore: 82,
            totalContributions: 27,
            joinDate: '2023-03-10T00:00:00Z',
            lastActive: '2023-09-14T18:21:05Z',
            verifiedContributions: 21
        },
        {
            id: 'contrib3',
            alias: 'KushKing420',
            trustScore: 76,
            totalContributions: 18,
            joinDate: '2023-04-20T00:00:00Z',
            lastActive: '2023-09-15T22:45:33Z',
            verifiedContributions: 14
        }
    ]);
    
    const menuItems = [
        {
            label: '📜 Browse Strain Registry',
            value: 'strains'
        },
        {
            label: '👥 View Contributors',
            value: 'contributors'
        },
        {
            label: '⛏️ Mine New Block',
            value: 'mine'
        },
        {
            label: '✅ Verify Submissions',
            value: 'verify'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else {
            setActiveScreen(item.value as 'STRAINS' | 'CONTRIBUTORS' | 'MINE' | 'VERIFY');
        }
    };
    
    const simulateMining = () => {
        setIsMining(true);
        setMiningProgress(0);
        
        const interval = setInterval(() => {
            setMiningProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishMining();
                    return 100;
                }
                return prev + Math.floor(Math.random() * 5) + 1;
            });
        }, 200);
    };
    
    const finishMining = () => {
        // Add a new mined block with pending strains verified
        setStrainRecords(prev => prev.map(strain => {
            if (strain.verificationStatus === 'PENDING') {
                return {
                    ...strain,
                    verificationStatus: 'VERIFIED',
                    blockHeight: Math.max(...prev.map(s => s.blockHeight)) + 1
                };
            }
            return strain;
        }));
        
        // Update contributor stats
        setContributors(prev => prev.map(contributor => {
            const verifiedStrains = strainRecords.filter(s => 
                s.contributorId === contributor.id && 
                s.verificationStatus === 'PENDING'
            );
            
            if (verifiedStrains.length > 0) {
                return {
                    ...contributor,
                    verifiedContributions: contributor.verifiedContributions + verifiedStrains.length,
                    lastActive: new Date().toISOString(),
                    trustScore: Math.min(100, contributor.trustScore + 1)
                };
            }
            return contributor;
        }));
        
        setIsMining(false);
    };
    
    const verifyStrain = (strainId: string) => {
        setIsVerifying(true);
        
        // Simulate verification process
        setTimeout(() => {
            setStrainRecords(prev => prev.map(strain => {
                if (strain.id === strainId && strain.verificationStatus === 'PENDING') {
                    return {
                        ...strain,
                        verificationStatus: 'VERIFIED'
                    };
                }
                return strain;
            }));
            
            setIsVerifying(false);
        }, 2000);
    };
    
    const disputeStrain = (strainId: string) => {
        setStrainRecords(prev => prev.map(strain => {
            if (strain.id === strainId) {
                return {
                    ...strain,
                    verificationStatus: 'DISPUTED'
                };
            }
            return strain;
        }));
    };
    
    // Format hash for display
    const formatHash = (hash: string) => {
        if (hash.length > 16) {
            return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
        }
        return hash;
    };
    
    // Main menu screen
    const renderMenuScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Decentralized Rip Ledger</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Track and verify strain origins and contributions on the blockchain</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text>Registered Strains: <Text bold color="green">{strainRecords.length}</Text></Text>
                <Text>Verified Strains: <Text bold color="blue">
                    {strainRecords.filter(s => s.verificationStatus === 'VERIFIED').length}
                </Text></Text>
                <Text>Network Status: <Text bold color="yellow">ACTIVE</Text></Text>
                <Text>Latest Block: <Text bold>{Math.max(...strainRecords.map(s => s.blockHeight))}</Text></Text>
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );
    
    // Strains registry screen
    const renderStrainsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">BROIP Strain Registry</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Browse verified strains on the decentralized ledger</Text>
            </Box>
            
            <Box flexDirection="column">
                {strainRecords.map(strain => (
                    <Box 
                        key={strain.id} 
                        flexDirection="column"
                        borderStyle={selectedStrainId === strain.id ? "double" : "single"}
                        borderColor={
                            strain.verificationStatus === 'VERIFIED' ? "green" :
                            strain.verificationStatus === 'PENDING' ? "yellow" : "red"
                        }
                        paddingX={2}
                        paddingY={1}
                        marginBottom={1}
                        onPress={() => setSelectedStrainId(
                            selectedStrainId === strain.id ? null : strain.id
                        )}
                    >
                        <Box>
                            <Text bold>{strain.name}</Text>
                            <Text> - </Text>
                            <Text color={
                                strain.verificationStatus === 'VERIFIED' ? "green" :
                                strain.verificationStatus === 'PENDING' ? "yellow" : "red"
                            }>
                                {strain.verificationStatus}
                            </Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>Origin: {strain.origin}</Text>
                            <Text> • </Text>
                            <Text>Contributor: {strain.contributorAlias}</Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>THC: {strain.thcContent}%</Text>
                            <Text> • </Text>
                            <Text>CBD: {strain.cbdContent}%</Text>
                            <Text> • </Text>
                            <Text>Total Rips: {strain.totalRips}</Text>
                        </Box>
                        
                        {selectedStrainId === strain.id && (
                            <>
                                <Box marginTop={1} flexDirection="column">
                                    <Text bold>Terpene Profile:</Text>
                                    <Box flexDirection="column" marginLeft={2}>
                                        {Object.entries(strain.terpeneProfile).map(([terpene, amount]) => (
                                            <Text key={terpene}>
                                                {terpene}: {(amount * 100).toFixed(1)}%
                                            </Text>
                                        ))}
                                    </Box>
                                </Box>
                                
                                <Box marginTop={1} flexDirection="column">
                                    <Text bold>Blockchain Data:</Text>
                                    <Text>Block: {strain.blockHeight}</Text>
                                    <Text>Timestamp: {new Date(strain.timestamp).toLocaleString()}</Text>
                                    <Text>Transaction: {formatHash(strain.transactionHash)}</Text>
                                </Box>
                            </>
                        )}
                    </Box>
                ))}
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Contributors screen
    const renderContributorsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Network Contributors</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>View the community members contributing strain data</Text>
            </Box>
            
            <Box flexDirection="column">
                {contributors.map(contributor => (
                    <Box 
                        key={contributor.id} 
                        flexDirection="column"
                        borderStyle={selectedContributorId === contributor.id ? "double" : "single"}
                        paddingX={2}
                        paddingY={1}
                        marginBottom={1}
                        onPress={() => setSelectedContributorId(
                            selectedContributorId === contributor.id ? null : contributor.id
                        )}
                    >
                        <Box>
                            <Text bold>{contributor.alias}</Text>
                            <Text> - </Text>
                            <Text color={
                                contributor.trustScore >= 90 ? "green" :
                                contributor.trustScore >= 70 ? "yellow" : "red"
                            }>
                                Trust Score: {contributor.trustScore}
                            </Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>Contributions: {contributor.totalContributions}</Text>
                            <Text> • </Text>
                            <Text>Verified: {contributor.verifiedContributions}</Text>
                        </Box>
                        
                        {selectedContributorId === contributor.id && (
                            <Box marginTop={1} flexDirection="column">
                                <Text>Member Since: {new Date(contributor.joinDate).toLocaleDateString()}</Text>
                                <Text>Last Active: {new Date(contributor.lastActive).toLocaleDateString()}</Text>
                                
                                <Box marginTop={1}>
                                    <Text bold>Contributed Strains:</Text>
                                    {strainRecords
                                        .filter(strain => strain.contributorId === contributor.id)
                                        .map(strain => (
                                            <Text key={strain.id}>
                                                - {strain.name} ({strain.verificationStatus})
                                            </Text>
                                        ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Mining screen
    const renderMiningScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Mine New Block</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Contribute computing power to validate pending strains</Text>
            </Box>
            
            {isMining ? (
                <Box flexDirection="column" marginY={1}>
                    <Text bold color="cyan">Mining In Progress</Text>
                    <Box marginY={1}>
                        <Text>Solving proof-of-work challenge: {miningProgress}%</Text>
                        <Box width={50} marginY={1}>
                            <Text>
                                {Array.from({length: 50}).map((_, i) => 
                                    i < miningProgress / 2 ? '█' : '░'
                                ).join('')}
                            </Text>
                        </Box>
                    </Box>
                    
                    <Box marginY={1}>
                        <Text>
                            <Text color="green">
                                <Spinner type="dots" />
                            </Text>
                            {' '}Working on block #{Math.max(...strainRecords.map(s => s.blockHeight)) + 1}
                        </Text>
                    </Box>
                    
                    <Box marginY={1}>
                        <Text>Current hash rate: {Math.floor(Math.random() * 500) + 500} H/s</Text>
                        <Text>Network difficulty: {(Math.random() * 2 + 1).toFixed(4)}</Text>
                    </Box>
                </Box>
            ) : (
                <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                    <Text bold>Mining Information</Text>
                    
                    <Box marginY={1}>
                        <Text>Pending Strains: {strainRecords.filter(s => s.verificationStatus === 'PENDING').length}</Text>
                        <Text>Estimated Reward: 0.05 BROIP Tokens</Text>
                        <Text>Estimated Time: 2-5 minutes</Text>
                    </Box>
                    
                    <Box marginY={1}>
                        <Text>Mining helps validate strain data and maintains</Text>
                        <Text>the integrity of the decentralized ledger.</Text>
                    </Box>
                    
                    <Box marginTop={1}>
                        <Box 
                            backgroundColor="green" 
                            paddingX={2} 
                            paddingY={1}
                            onPress={simulateMining}
                        >
                            <Text color="white">Start Mining</Text>
                        </Box>
                    </Box>
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => {
                        if (!isMining) {
                            setActiveScreen('MENU');
                        }
                    }}>
                        {isMining ? 'Please Wait...' : 'Back'}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Verification screen
    const renderVerifyScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Verify Strain Submissions</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Help maintain the accuracy of strain data by verifying submissions</Text>
            </Box>
            
            {isVerifying ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Verifying strain data...
                    </Text>
                    <Text>Checking chemical analysis against consensus data</Text>
                </Box>
            ) : (
                <Box flexDirection="column">
                    {strainRecords
                        .filter(strain => strain.verificationStatus === 'PENDING')
                        .map(strain => (
                            <Box 
                                key={strain.id} 
                                flexDirection="column"
                                borderStyle="single"
                                borderColor="yellow"
                                paddingX={2}
                                paddingY={1}
                                marginBottom={1}
                            >
                                <Box>
                                    <Text bold>{strain.name}</Text>
                                    <Text> - </Text>
                                    <Text color="yellow">PENDING VERIFICATION</Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text>Origin: {strain.origin}</Text>
                                    <Text> • </Text>
                                    <Text>Contributor: {strain.contributorAlias}</Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text>THC: {strain.thcContent}%</Text>
                                    <Text> • </Text>
                                    <Text>CBD: {strain.cbdContent}%</Text>
                                </Box>
                                
                                <Box marginTop={1} flexDirection="column">
                                    <Text bold>Terpene Profile:</Text>
                                    <Box flexDirection="column" marginLeft={2}>
                                        {Object.entries(strain.terpeneProfile).map(([terpene, amount]) => (
                                            <Text key={terpene}>
                                                {terpene}: {(amount * 100).toFixed(1)}%
                                            </Text>
                                        ))}
                                    </Box>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Box 
                                        backgroundColor="green" 
                                        paddingX={2} 
                                        paddingY={1}
                                        marginRight={1}
                                        onPress={() => verifyStrain(strain.id)}
                                    >
                                        <Text color="white">Verify</Text>
                                    </Box>
                                    
                                    <Box 
                                        backgroundColor="red" 
                                        paddingX={2} 
                                        paddingY={1}
                                        onPress={() => disputeStrain(strain.id)}
                                    >
                                        <Text color="white">Dispute</Text>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                        
                    {strainRecords.filter(strain => strain.verificationStatus === 'PENDING').length === 0 && (
                        <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                            <Text>No pending strains to verify at this time.</Text>
                            <Text>Check back later for new submissions.</Text>
                        </Box>
                    )}
                </Box>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => {
                        if (!isVerifying) {
                            setActiveScreen('MENU');
                        }
                    }}>
                        {isVerifying ? 'Please Wait...' : 'Back'}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
    
    if (activeScreen === 'STRAINS') {
        return renderStrainsScreen();
    }
    
    if (activeScreen === 'CONTRIBUTORS') {
        return renderContributorsScreen();
    }
    
    if (activeScreen === 'MINE') {
        return renderMiningScreen();
    }
    
    if (activeScreen === 'VERIFY') {
        return renderVerifyScreen();
    }
    
    return renderMenuScreen();
};

export default DecentralizedLedger;

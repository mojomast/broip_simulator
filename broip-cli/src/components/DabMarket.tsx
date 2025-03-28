import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { Concentrate, UserProfile } from '../utils/marketTypes';

interface DabMarketProps {
    onReturn: () => void;
    userProfile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
}

const DabMarket: React.FC<DabMarketProps> = ({ onReturn, userProfile, onUpdateProfile }) => {
    const [view, setView] = useState<'MARKET' | 'INVENTORY' | 'TRADE'>('MARKET');
    const [concentrates, setConcentrates] = useState<Concentrate[]>([]);
    const [selectedConcentrate, setSelectedConcentrate] = useState<Concentrate | null>(null);
    const [amount, setAmount] = useState(0);
    const [marketTick, setMarketTick] = useState(0);

    useEffect(() => {
        // Simulate market updates
        const interval = setInterval(() => {
            setMarketTick(prev => prev + 1);
            updateMarketPrices();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const updateMarketPrices = () => {
        setConcentrates(prev => prev.map(c => ({
            ...c,
            currentPrice: Math.max(0.1, c.currentPrice * (1 + (Math.random() - 0.5) * 0.2)),
            priceHistory: [...c.priceHistory, c.currentPrice].slice(-10)
        })));
    };

    useEffect(() => {
        // Initialize market with some concentrates
        const initialConcentrates: Concentrate[] = [
            {
                id: '1',
                name: 'OG Shatter',
                type: 'SHATTER',
                thcContent: 80 + Math.random() * 10,
                terpeneProfile: ['Myrcene', 'Limonene'],
                currentPrice: 50,
                priceHistory: [50],
                rarity: 'COMMON'
            },
            {
                id: '2',
                name: 'Purple Diamonds',
                type: 'DIAMONDS',
                thcContent: 90 + Math.random() * 5,
                terpeneProfile: ['Pinene', 'Caryophyllene'],
                currentPrice: 120,
                priceHistory: [120],
                rarity: 'RARE'
            },
            // Add more initial concentrates...
        ];
        setConcentrates(initialConcentrates);
    }, []);

    const getPriceColor = (item: Concentrate) => {
        const lastTwo = item.priceHistory.slice(-2);
        if (lastTwo.length < 2) return 'white';
        return lastTwo[1] > lastTwo[0] ? 'green' : lastTwo[1] < lastTwo[0] ? 'red' : 'white';
    };

    const getRarityColor = (rarity: string) => {
        switch(rarity) {
            case 'LEGENDARY': return 'magenta';
            case 'RARE': return 'blue';
            case 'UNCOMMON': return 'green';
            default: return 'white';
        }
    };

    const handleBuy = (concentrate: Concentrate) => {
        if (userProfile.dabCoins >= concentrate.currentPrice) {
            const newProfile = {
                ...userProfile,
                dabCoins: userProfile.dabCoins - concentrate.currentPrice,
                inventory: [
                    ...userProfile.inventory,
                    {
                        concentrateId: concentrate.id,
                        amount: 1,
                        purchasePrice: concentrate.currentPrice,
                        timestamp: new Date().toISOString()
                    }
                ]
            };
            onUpdateProfile(newProfile);
        }
    };

    const marketItems = concentrates.map(c => ({
        label: `${c.name} (${c.type}) - ${c.thcContent.toFixed(1)}% THC - ${c.currentPrice.toFixed(2)} DC`,
        value: c
    }));

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="green">BROIP DAB MARKET v4.20</Text>
            
            <Box marginY={1}>
                <Text>Your DabCoins: </Text>
                <Text color="yellow">{userProfile.dabCoins.toFixed(2)} DC</Text>
            </Box>

            <Box marginY={1}>
                <Text color="green"><Spinner type="dots"/></Text>
                <Text> Market Tick: {marketTick}</Text>
            </Box>

            <Box flexDirection="column">
                {concentrates.map((item, i) => (
                    <Box key={i} marginY={1}>
                        <Text>
                            <Text color={getRarityColor(item.rarity)}>{item.name}</Text>
                            {' - '}
                            <Text color={getPriceColor(item)}>{item.currentPrice.toFixed(2)} DC</Text>
                            {' - '}
                            <Text dimColor>{item.thcContent.toFixed(1)}% THC</Text>
                        </Text>
                    </Box>
                ))}
            </Box>

            <Box marginY={1}>
                <SelectInput 
                    items={marketItems} 
                    onSelect={(item) => handleBuy(item.value)} 
                />
            </Box>

            <Box marginTop={1}>
                <Text color="cyan">Press 'x' to return • Space to refresh market</Text>
            </Box>
        </Box>
    );
};

export default DabMarket;

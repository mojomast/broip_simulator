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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const ink_select_input_1 = __importDefault(require("ink-select-input"));
const ink_spinner_1 = __importDefault(require("ink-spinner"));
const DabMarket = ({ onReturn, userProfile, onUpdateProfile }) => {
    const [view, setView] = (0, react_1.useState)('MARKET');
    const [concentrates, setConcentrates] = (0, react_1.useState)([]);
    const [selectedConcentrate, setSelectedConcentrate] = (0, react_1.useState)(null);
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [marketTick, setMarketTick] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        // Initialize market with some concentrates
        const initialConcentrates = [
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
    const getPriceColor = (item) => {
        const lastTwo = item.priceHistory.slice(-2);
        if (lastTwo.length < 2)
            return 'white';
        return lastTwo[1] > lastTwo[0] ? 'green' : lastTwo[1] < lastTwo[0] ? 'red' : 'white';
    };
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'LEGENDARY': return 'magenta';
            case 'RARE': return 'blue';
            case 'UNCOMMON': return 'green';
            default: return 'white';
        }
    };
    const handleBuy = (concentrate) => {
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
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP DAB MARKET v4.20"),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, null, "Your DabCoins: "),
            react_1.default.createElement(ink_1.Text, { color: "yellow" },
                userProfile.dabCoins.toFixed(2),
                " DC")),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, { color: "green" },
                react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
            react_1.default.createElement(ink_1.Text, null,
                " Market Tick: ",
                marketTick)),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, concentrates.map((item, i) => (react_1.default.createElement(ink_1.Box, { key: i, marginY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: getRarityColor(item.rarity) }, item.name),
                ' - ',
                react_1.default.createElement(ink_1.Text, { color: getPriceColor(item) },
                    item.currentPrice.toFixed(2),
                    " DC"),
                ' - ',
                react_1.default.createElement(ink_1.Text, { dimColor: true },
                    item.thcContent.toFixed(1),
                    "% THC")))))),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_select_input_1.default, { items: marketItems, onSelect: (item) => handleBuy(item.value) })),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: "cyan" }, "Press 'x' to return \u2022 Space to refresh market"))));
};
exports.default = DabMarket;

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
const UserContext_1 = require("../utils/UserContext");
const DecentralizedLedger = ({ onReturn }) => {
    const { preferences } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [selectedStrainId, setSelectedStrainId] = (0, react_1.useState)(null);
    const [selectedContributorId, setSelectedContributorId] = (0, react_1.useState)(null);
    const [isMining, setIsMining] = (0, react_1.useState)(false);
    const [miningProgress, setMiningProgress] = (0, react_1.useState)(0);
    const [isVerifying, setIsVerifying] = (0, react_1.useState)(false);
    // Sample data
    const [strainRecords, setStrainRecords] = (0, react_1.useState)([
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
    const [contributors, setContributors] = (0, react_1.useState)([
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
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else {
            setActiveScreen(item.value);
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
            const verifiedStrains = strainRecords.filter(s => s.contributorId === contributor.id &&
                s.verificationStatus === 'PENDING');
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
    const verifyStrain = (strainId) => {
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
    const disputeStrain = (strainId) => {
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
    const formatHash = (hash) => {
        if (hash.length > 16) {
            return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
        }
        return hash;
    };
    // Main menu screen
    const renderMenuScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Decentralized Rip Ledger")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Track and verify strain origins and contributions on the blockchain")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Registered Strains: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, strainRecords.length)),
            react_1.default.createElement(ink_1.Text, null,
                "Verified Strains: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "blue" }, strainRecords.filter(s => s.verificationStatus === 'VERIFIED').length)),
            react_1.default.createElement(ink_1.Text, null,
                "Network Status: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" }, "ACTIVE")),
            react_1.default.createElement(ink_1.Text, null,
                "Latest Block: ",
                react_1.default.createElement(ink_1.Text, { bold: true }, Math.max(...strainRecords.map(s => s.blockHeight))))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
    // Strains registry screen
    const renderStrainsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP Strain Registry")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Browse verified strains on the decentralized ledger")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, strainRecords.map(strain => (react_1.default.createElement(ink_1.Box, { key: strain.id, flexDirection: "column", borderStyle: selectedStrainId === strain.id ? "double" : "single", borderColor: strain.verificationStatus === 'VERIFIED' ? "green" :
                strain.verificationStatus === 'PENDING' ? "yellow" : "red", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedStrainId(selectedStrainId === strain.id ? null : strain.id) },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, strain.name),
                react_1.default.createElement(ink_1.Text, null, " - "),
                react_1.default.createElement(ink_1.Text, { color: strain.verificationStatus === 'VERIFIED' ? "green" :
                        strain.verificationStatus === 'PENDING' ? "yellow" : "red" }, strain.verificationStatus)),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Origin: ",
                    strain.origin),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, null,
                    "Contributor: ",
                    strain.contributorAlias)),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "THC: ",
                    strain.thcContent,
                    "%"),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, null,
                    "CBD: ",
                    strain.cbdContent,
                    "%"),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, null,
                    "Total Rips: ",
                    strain.totalRips)),
            selectedStrainId === strain.id && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Terpene Profile:"),
                    react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginLeft: 2 }, Object.entries(strain.terpeneProfile).map(([terpene, amount]) => (react_1.default.createElement(ink_1.Text, { key: terpene },
                        terpene,
                        ": ",
                        (amount * 100).toFixed(1),
                        "%"))))),
                react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Blockchain Data:"),
                    react_1.default.createElement(ink_1.Text, null,
                        "Block: ",
                        strain.blockHeight),
                    react_1.default.createElement(ink_1.Text, null,
                        "Timestamp: ",
                        new Date(strain.timestamp).toLocaleString()),
                    react_1.default.createElement(ink_1.Text, null,
                        "Transaction: ",
                        formatHash(strain.transactionHash))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Contributors screen
    const renderContributorsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Network Contributors")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "View the community members contributing strain data")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, contributors.map(contributor => (react_1.default.createElement(ink_1.Box, { key: contributor.id, flexDirection: "column", borderStyle: selectedContributorId === contributor.id ? "double" : "single", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedContributorId(selectedContributorId === contributor.id ? null : contributor.id) },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, contributor.alias),
                react_1.default.createElement(ink_1.Text, null, " - "),
                react_1.default.createElement(ink_1.Text, { color: contributor.trustScore >= 90 ? "green" :
                        contributor.trustScore >= 70 ? "yellow" : "red" },
                    "Trust Score: ",
                    contributor.trustScore)),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Contributions: ",
                    contributor.totalContributions),
                react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                react_1.default.createElement(ink_1.Text, null,
                    "Verified: ",
                    contributor.verifiedContributions)),
            selectedContributorId === contributor.id && (react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null,
                    "Member Since: ",
                    new Date(contributor.joinDate).toLocaleDateString()),
                react_1.default.createElement(ink_1.Text, null,
                    "Last Active: ",
                    new Date(contributor.lastActive).toLocaleDateString()),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Contributed Strains:"),
                    strainRecords
                        .filter(strain => strain.contributorId === contributor.id)
                        .map(strain => (react_1.default.createElement(ink_1.Text, { key: strain.id },
                        "- ",
                        strain.name,
                        " (",
                        strain.verificationStatus,
                        ")")))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Mining screen
    const renderMiningScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Mine New Block")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Contribute computing power to validate pending strains")),
        isMining ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "cyan" }, "Mining In Progress"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Solving proof-of-work challenge: ",
                    miningProgress,
                    "%"),
                react_1.default.createElement(ink_1.Box, { width: 50, marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, Array.from({ length: 50 }).map((_, i) => i < miningProgress / 2 ? '█' : '░').join('')))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    react_1.default.createElement(ink_1.Text, { color: "green" },
                        react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                    ' ',
                    "Working on block #",
                    Math.max(...strainRecords.map(s => s.blockHeight)) + 1)),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Current hash rate: ",
                    Math.floor(Math.random() * 500) + 500,
                    " H/s"),
                react_1.default.createElement(ink_1.Text, null,
                    "Network difficulty: ",
                    (Math.random() * 2 + 1).toFixed(4))))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Mining Information"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Pending Strains: ",
                    strainRecords.filter(s => s.verificationStatus === 'PENDING').length),
                react_1.default.createElement(ink_1.Text, null, "Estimated Reward: 0.05 BROIP Tokens"),
                react_1.default.createElement(ink_1.Text, null, "Estimated Time: 2-5 minutes")),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, "Mining helps validate strain data and maintains"),
                react_1.default.createElement(ink_1.Text, null, "the integrity of the decentralized ledger.")),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, onPress: simulateMining },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Start Mining"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => {
                        if (!isMining) {
                            setActiveScreen('MENU');
                        }
                    } }, isMining ? 'Please Wait...' : 'Back')))));
    // Verification screen
    const renderVerifyScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Verify Strain Submissions")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Help maintain the accuracy of strain data by verifying submissions")),
        isVerifying ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Verifying strain data..."),
            react_1.default.createElement(ink_1.Text, null, "Checking chemical analysis against consensus data"))) : (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            strainRecords
                .filter(strain => strain.verificationStatus === 'PENDING')
                .map(strain => (react_1.default.createElement(ink_1.Box, { key: strain.id, flexDirection: "column", borderStyle: "single", borderColor: "yellow", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, strain.name),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: "yellow" }, "PENDING VERIFICATION")),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "Origin: ",
                        strain.origin),
                    react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                    react_1.default.createElement(ink_1.Text, null,
                        "Contributor: ",
                        strain.contributorAlias)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        "THC: ",
                        strain.thcContent,
                        "%"),
                    react_1.default.createElement(ink_1.Text, null, " \u2022 "),
                    react_1.default.createElement(ink_1.Text, null,
                        "CBD: ",
                        strain.cbdContent,
                        "%")),
                react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Terpene Profile:"),
                    react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginLeft: 2 }, Object.entries(strain.terpeneProfile).map(([terpene, amount]) => (react_1.default.createElement(ink_1.Text, { key: terpene },
                        terpene,
                        ": ",
                        (amount * 100).toFixed(1),
                        "%"))))),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "green", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => verifyStrain(strain.id) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Verify")),
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "red", paddingX: 2, paddingY: 1, onPress: () => disputeStrain(strain.id) },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Dispute")))))),
            strainRecords.filter(strain => strain.verificationStatus === 'PENDING').length === 0 && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "No pending strains to verify at this time."),
                react_1.default.createElement(ink_1.Text, null, "Check back later for new submissions."))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => {
                        if (!isVerifying) {
                            setActiveScreen('MENU');
                        }
                    } }, isVerifying ? 'Please Wait...' : 'Back')))));
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
exports.default = DecentralizedLedger;

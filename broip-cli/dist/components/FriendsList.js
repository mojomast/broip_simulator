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
const FriendsList = ({ onReturn, userProfile, onUpdateProfile }) => {
    const [view, setView] = (0, react_1.useState)('LIST');
    const [selectedFriend, setSelectedFriend] = (0, react_1.useState)(null);
    const [newFriendName, setNewFriendName] = (0, react_1.useState)('');
    const [selectedDab, setSelectedDab] = (0, react_1.useState)(null);
    (0, ink_1.useInput)((input, key) => {
        if (input.toLowerCase() === 'x') {
            if (view !== 'LIST') {
                setView('LIST');
                setSelectedFriend(null);
                setSelectedDab(null);
            }
            else {
                onReturn();
            }
            return;
        }
        if (view === 'ADD') {
            if (key.return) {
                handleAddFriend();
            }
            else if (key.backspace || key.delete) {
                setNewFriendName(prev => prev.slice(0, -1));
            }
            else {
                setNewFriendName(prev => prev + input);
            }
        }
    });
    const handleAddFriend = () => {
        if (newFriendName.length > 0) {
            const newFriend = {
                id: Math.random().toString(36).substring(7),
                username: newFriendName,
                status: Math.random() > 0.5 ? 'ONLINE' : 'OFFLINE',
                lastActive: new Date().toISOString()
            };
            onUpdateProfile({
                ...userProfile,
                friends: [...userProfile.friends, newFriend]
            });
            setNewFriendName('');
            setView('LIST');
        }
    };
    const handleSendDab = (friend, dab) => {
        // Remove dab from inventory
        const newInventory = userProfile.inventory.filter(item => item !== dab);
        // Update stats
        const newStats = {
            ...userProfile.stats,
            dabsShared: userProfile.stats.dabsShared + 1
        };
        onUpdateProfile({
            ...userProfile,
            inventory: newInventory,
            stats: newStats
        });
        setView('LIST');
        setSelectedFriend(null);
        setSelectedDab(null);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'ONLINE': return 'green';
            case 'DABBING': return 'yellow';
            default: return 'gray';
        }
    };
    const renderFriendsList = () => {
        const items = [
            { label: 'Add New Friend', value: 'add' },
            { label: 'Send a Dab', value: 'send' },
            ...userProfile.friends.map(f => ({
                label: `${f.username} (${f.status})`,
                value: f.id,
                friend: f
            }))
        ];
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Friends List (",
                userProfile.friends.length,
                ")"),
            userProfile.friends.map((friend, i) => (react_1.default.createElement(ink_1.Box, { key: i, marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    react_1.default.createElement(ink_1.Text, { color: getStatusColor(friend.status) }, "\u25CF"),
                    ' ',
                    friend.username,
                    ' - ',
                    react_1.default.createElement(ink_1.Text, { dimColor: true }, friend.status))))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_select_input_1.default, { items: items, onSelect: (item) => {
                        if (item.value === 'add') {
                            setView('ADD');
                        }
                        else if (item.value === 'send') {
                            setView('SEND');
                        }
                        else if (item.friend) {
                            setSelectedFriend(item.friend);
                        }
                    } }))));
    };
    const renderAddFriend = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Text, { bold: true }, "Add New Friend"),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_1.Text, null, "Enter username: "),
            react_1.default.createElement(ink_1.Text, { color: "yellow" },
                newFriendName,
                "_")),
        react_1.default.createElement(ink_1.Text, { dimColor: true }, "Press Enter to add \u2022 X to cancel")));
    const renderSendDab = () => {
        const friendItems = userProfile.friends.map(f => ({
            label: f.username,
            value: f.id,
            friend: f
        }));
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Send a Dab"),
            !selectedFriend ? (react_1.default.createElement(ink_select_input_1.default, { items: friendItems, onSelect: (item) => item.friend && setSelectedFriend(item.friend) })) : !selectedDab ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null,
                    "Select dab to send to ",
                    selectedFriend.username,
                    ":"),
                react_1.default.createElement(ink_select_input_1.default, { items: userProfile.inventory.map(item => ({
                        label: `Dab #${item.concentrateId} (${item.purchasePrice} DC)`,
                        value: item.concentrateId,
                        dab: item
                    })), onSelect: (item) => item.dab && handleSendDab(selectedFriend, item.dab) }))) : null));
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "BROIP FRIENDS NETWORK v4.20"),
        view === 'LIST' && renderFriendsList(),
        view === 'ADD' && renderAddFriend(),
        view === 'SEND' && renderSendDab(),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Text, { color: "cyan" }, view === 'LIST' ?
                "Select a friend to view details • X to exit" :
                "X to go back"))));
};
exports.default = FriendsList;

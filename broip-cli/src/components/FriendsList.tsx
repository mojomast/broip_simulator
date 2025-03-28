import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Friend, UserProfile, UserInventoryItem } from '../utils/marketTypes';

interface FriendsListProps {
    onReturn: () => void;
    userProfile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
}

interface FriendItem {
    label: string;
    value: string;
    friend?: Friend;
}

interface DabItem {
    label: string;
    value: string;
    dab?: UserInventoryItem;
}

const FriendsList: React.FC<FriendsListProps> = ({ onReturn, userProfile, onUpdateProfile }) => {
    const [view, setView] = useState<'LIST' | 'ADD' | 'SEND'>('LIST');
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [newFriendName, setNewFriendName] = useState('');
    const [selectedDab, setSelectedDab] = useState<UserInventoryItem | null>(null);

    useInput((input, key) => {
        if (input.toLowerCase() === 'x') {
            if (view !== 'LIST') {
                setView('LIST');
                setSelectedFriend(null);
                setSelectedDab(null);
            } else {
                onReturn();
            }
            return;
        }

        if (view === 'ADD') {
            if (key.return) {
                handleAddFriend();
            } else if (key.backspace || key.delete) {
                setNewFriendName(prev => prev.slice(0, -1));
            } else {
                setNewFriendName(prev => prev + input);
            }
        }
    });

    const handleAddFriend = () => {
        if (newFriendName.length > 0) {
            const newFriend: Friend = {
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

    const handleSendDab = (friend: Friend, dab: UserInventoryItem) => {
        // Remove dab from inventory
        const newInventory = userProfile.inventory.filter(item => 
            item !== dab
        );

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

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'ONLINE': return 'green';
            case 'DABBING': return 'yellow';
            default: return 'gray';
        }
    };

    const renderFriendsList = () => {
        const items: FriendItem[] = [
            { label: 'Add New Friend', value: 'add' },
            { label: 'Send a Dab', value: 'send' },
            ...userProfile.friends.map(f => ({
                label: `${f.username} (${f.status})`,
                value: f.id,
                friend: f
            }))
        ];

        return (
            <Box flexDirection="column">
                <Text bold>Friends List ({userProfile.friends.length})</Text>
                {userProfile.friends.map((friend, i) => (
                    <Box key={i} marginY={1}>
                        <Text>
                            <Text color={getStatusColor(friend.status)}>●</Text>
                            {' '}
                            {friend.username}
                            {' - '}
                            <Text dimColor>{friend.status}</Text>
                        </Text>
                    </Box>
                ))}
                
                <Box marginY={1}>
                    <SelectInput
                        items={items}
                        onSelect={(item: FriendItem) => {
                            if (item.value === 'add') {
                                setView('ADD');
                            } else if (item.value === 'send') {
                                setView('SEND');
                            } else if (item.friend) {
                                setSelectedFriend(item.friend);
                            }
                        }}
                    />
                </Box>
            </Box>
        );
    };

    const renderAddFriend = () => (
        <Box flexDirection="column">
            <Text bold>Add New Friend</Text>
            <Box marginY={1}>
                <Text>Enter username: </Text>
                <Text color="yellow">{newFriendName}_</Text>
            </Box>
            <Text dimColor>Press Enter to add • X to cancel</Text>
        </Box>
    );

    const renderSendDab = () => {
        const friendItems: FriendItem[] = userProfile.friends.map(f => ({
            label: f.username,
            value: f.id,
            friend: f
        }));

        return (
            <Box flexDirection="column">
                <Text bold>Send a Dab</Text>
                {!selectedFriend ? (
                    <SelectInput
                        items={friendItems}
                        onSelect={(item: FriendItem) => item.friend && setSelectedFriend(item.friend)}
                    />
                ) : !selectedDab ? (
                    <Box flexDirection="column">
                        <Text>Select dab to send to {selectedFriend.username}:</Text>
                        <SelectInput
                            items={userProfile.inventory.map(item => ({
                                label: `Dab #${item.concentrateId} (${item.purchasePrice} DC)`,
                                value: item.concentrateId,
                                dab: item
                            }))}
                            onSelect={(item: DabItem) => item.dab && handleSendDab(selectedFriend, item.dab)}
                        />
                    </Box>
                ) : null}
            </Box>
        );
    };

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="green">BROIP FRIENDS NETWORK v4.20</Text>
            
            {view === 'LIST' && renderFriendsList()}
            {view === 'ADD' && renderAddFriend()}
            {view === 'SEND' && renderSendDab()}

            <Box marginTop={1}>
                <Text color="cyan">
                    {view === 'LIST' ? 
                        "Select a friend to view details • X to exit" :
                        "X to go back"}
                </Text>
            </Box>
        </Box>
    );
};

export default FriendsList;

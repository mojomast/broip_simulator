import React, {useState} from 'react';
import {Box, Text} from 'ink';
import {PacketData} from '../utils/types';

const RipReceiver: React.FC = () => {
    const [packets, setPackets] = useState<PacketData[]>([]);

    return (
        <Box flexDirection="column">
            <Text bold>Rip Receiver (RR)</Text>
            <Text>Packets received: {packets.length}</Text>
        </Box>
    );
};

export default RipReceiver;


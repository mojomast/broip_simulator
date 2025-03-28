export interface MenuOption {
    label: string;
    value: 'ri' | 'monitor' | 'crystal' | 'diffusion' | 'bowl' | 'market' | 'friends' | 'routes' | 'exit' | 'menu' | 'achievements' | 'sensory' | 'ripapi' | 'ledger' | 'legal' | 'autocarb' | 'settings' | 'theme' | 'notifications' | 'optimization' | 'fidelity' | 'metrics' | 'back' | 'neural';
}

export interface RipData {
    strength: number;
    duration: number;
    timestamp: number;
}

export interface PacketData {
    id: string;
    ripData: RipData;
    fragment: number;
    totalFragments: number;
}

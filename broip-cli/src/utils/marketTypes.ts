export interface Concentrate {
    id: string;
    name: string;
    type: 'SHATTER' | 'WAX' | 'LIVE_RESIN' | 'ROSIN' | 'DIAMONDS' | 'SAUCE';
    thcContent: number;
    terpeneProfile: string[];
    currentPrice: number;
    priceHistory: number[];
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';
}

export interface UserProfile {
    id: string;
    username: string;
    dabCoins: number;
    inventory: UserInventoryItem[];
    friends: Friend[];
    stats: UserStats;
}

export interface UserInventoryItem {
    concentrateId: string;
    amount: number;
    purchasePrice: number;
    timestamp: string;
}

export interface Friend {
    id: string;
    username: string;
    status: 'ONLINE' | 'OFFLINE' | 'DABBING';
    lastActive: string;
}

export interface UserStats {
    totalDabs: number;
    dabsShared: number;
    profitMade: number;
    rareDabsFound: number;
    perfectDabs: number;
    // Route-related statistics
    routesCreated: number;
    routesOptimized: number;
    highestReliabilityRoute: number;
}

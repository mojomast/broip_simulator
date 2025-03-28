export interface RipPacket {
    id: string;
    timestamp: string;
    milkDensity: number;  // 0-100
    crystalPurity: number;  // 0-100
    percolationRate: number;  // bubbles per second
    bowlStatus: 'FRESH' | 'PARTIALLY_CACHED' | 'CACHED';
    chamberTemp: number;  // in degrees
}

export interface BowlStats {
    totalRips: number;
    avgMilkDensity: number;
    peakPercolation: number;
    crystalRating: number;
    uptime: number;
}

export interface CrystalAnalysis {
    density: number;
    clarity: number;
    structure: string;
    potency: number;
    recommendation: string;
}

export type PercolationType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'HONEYCOMB' | 'TREE' | 'MATRIX';

export interface DiffusionConfig {
    percolationType: PercolationType;
    waterLevel: number;  // 0-100
    iceNotches: number;
    dragCoefficient: number;
}

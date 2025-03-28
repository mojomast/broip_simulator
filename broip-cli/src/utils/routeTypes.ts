export interface RouteNode {
    id: string;
    name: string;
    type: 'BONG' | 'PIPE' | 'DAB_RIG' | 'ROUTER' | 'ENDPOINT';
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    coordinates: {
        x: number;
        y: number;
    };
    connections: string[]; // Array of node IDs this node is connected to
    properties?: {
        percolation?: number;
        milkDensity?: number;
        dragCoefficient?: number;
        latency?: number;
    };
}

export interface Route {
    id: string;
    name: string;
    nodes: string[]; // Ordered array of node IDs in the route
    status: 'ACTIVE' | 'PLANNING' | 'FAILED';
    metrics: {
        totalLatency: number;
        avgMilkDensity: number;
        hopCount: number;
        reliability: number;
    };
}

export interface NetworkGraph {
    nodes: Map<string, RouteNode>;
    routes: Route[];
    activeRoute?: string;
}

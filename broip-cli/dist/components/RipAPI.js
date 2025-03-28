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
const RipAPI = ({ onReturn }) => {
    const { preferences } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [docsSection, setDocsSection] = (0, react_1.useState)('OVERVIEW');
    const [selectedEndpoint, setSelectedEndpoint] = (0, react_1.useState)(null);
    const [isGeneratingKey, setIsGeneratingKey] = (0, react_1.useState)(false);
    const [apiKeys, setApiKeys] = (0, react_1.useState)([
        {
            id: 'key1',
            name: 'Development Key',
            key: 'brp_dev_' + Math.random().toString(36).substring(2, 15),
            created: '2023-09-15T14:22:31Z',
            lastUsed: '2023-10-18T09:45:12Z',
            callsMade: 437,
            status: 'ACTIVE'
        }
    ]);
    const [thirdPartyApps, setThirdPartyApps] = (0, react_1.useState)([
        {
            id: 'app1',
            name: 'RipMetrics Dashboard',
            description: 'Visualize your rip analytics with beautiful graphs and insights',
            developer: 'BROlytics, Inc.',
            website: 'https://ripmetrics.io',
            status: 'APPROVED',
            installUrl: 'https://ripmetrics.io/install'
        },
        {
            id: 'app2',
            name: 'TerpTracker Pro',
            description: 'Track terpene profiles across your rip sessions',
            developer: 'CannaCode Solutions',
            website: 'https://terptrackerapp.com',
            status: 'APPROVED',
            installUrl: 'https://terptrackerapp.com/connect'
        },
        {
            id: 'app3',
            name: 'CloudConnect Social',
            description: 'Share your best rips with friends and the community',
            developer: 'SocialRips LLC',
            website: 'https://cloudconnect.social',
            status: 'PENDING',
            installUrl: 'https://cloudconnect.social/broip'
        }
    ]);
    const endpoints = [
        {
            id: 'get-session',
            name: 'Get Session',
            method: 'GET',
            path: '/api/v1/sessions/{session_id}',
            description: 'Retrieve details about a specific BROIP session',
            parameters: [
                {
                    name: 'session_id',
                    type: 'string',
                    required: true,
                    description: 'Unique identifier for the session'
                }
            ],
            responseExample: '{\n  "session_id": "sess_1a2b3c4d",\n  "start_time": "2023-10-19T15:30:00Z",\n  "duration_ms": 12500,\n  "nodes": ["node1", "node3", "node7"],\n  "terpene_profile": {\n    "myrcene": 0.35,\n    "limonene": 0.22,\n    "pinene": 0.18\n  },\n  "rip_quality": 0.87\n}',
            authed: true,
            rateLimit: 100
        },
        {
            id: 'create-session',
            name: 'Create Session',
            method: 'POST',
            path: '/api/v1/sessions',
            description: 'Initialize a new BROIP session with custom parameters',
            parameters: [
                {
                    name: 'strain_profile',
                    type: 'object',
                    required: true,
                    description: 'Terpene profile information for the session'
                },
                {
                    name: 'quality_tier',
                    type: 'string',
                    required: false,
                    description: 'RQoS tier to use (standard, premium, ultra)'
                },
                {
                    name: 'peer_ids',
                    type: 'array',
                    required: false,
                    description: 'Array of peer IDs to connect for P2P sessions'
                }
            ],
            responseExample: '{\n  "session_id": "sess_9z8y7x6w",\n  "status": "initialized",\n  "connection_details": {\n    "ip": "203.0.113.42",\n    "port": 8432,\n    "protocol": "broip+tls"\n  }\n}',
            authed: true,
            rateLimit: 20
        },
        {
            id: 'list-harn-nodes',
            name: 'List HARN Nodes',
            method: 'GET',
            path: '/api/v1/harn/nodes',
            description: 'Get a list of available High-Altitude Relay Nodes and their status',
            parameters: [
                {
                    name: 'region',
                    type: 'string',
                    required: false,
                    description: 'Filter nodes by geographical region'
                },
                {
                    name: 'status',
                    type: 'string',
                    required: false,
                    description: 'Filter by node status (active, maintenance, offline)'
                }
            ],
            responseExample: '{\n  "nodes": [\n    {\n      "id": "harn-us-west-1a",\n      "status": "active",\n      "load": 0.37,\n      "latency_ms": 42,\n      "region": "us-west"\n    },\n    {\n      "id": "harn-eu-central-2b",\n      "status": "active",\n      "load": 0.62,\n      "latency_ms": 112,\n      "region": "eu-central"\n    }\n  ]\n}',
            authed: true,
            rateLimit: 50
        },
        {
            id: 'get-terpene-analysis',
            name: 'Analyze Terpenes',
            method: 'POST',
            path: '/api/v1/terpenes/analyze',
            description: 'Process and analyze a terpene profile using the TCA algorithm',
            parameters: [
                {
                    name: 'terpene_data',
                    type: 'object',
                    required: true,
                    description: 'Raw terpene percentages to analyze'
                },
                {
                    name: 'compression_level',
                    type: 'integer',
                    required: false,
                    description: 'Desired compression level (1-10)'
                }
            ],
            responseExample: '{\n  "original_size_bytes": 4096,\n  "compressed_size_bytes": 512,\n  "compression_ratio": 8.0,\n  "estimated_fidelity": 0.96,\n  "recommended_compression": 7\n}',
            authed: true,
            rateLimit: 30
        }
    ];
    const menuItems = [
        {
            label: '📚 API Documentation',
            value: 'docs'
        },
        {
            label: '🔑 Manage API Keys',
            value: 'keys'
        },
        {
            label: '🧩 Third-Party Applications',
            value: 'apps'
        },
        {
            label: '🧪 API Playground',
            value: 'playground'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    const docSectionItems = [
        {
            label: '📋 API Overview',
            value: 'OVERVIEW'
        },
        {
            label: '🛣️ Endpoints Reference',
            value: 'ENDPOINTS'
        },
        {
            label: '🔐 Authentication Guide',
            value: 'AUTHENTICATION'
        },
        {
            label: '💻 Code Examples',
            value: 'EXAMPLES'
        },
        {
            label: '↩️ Back to API Menu',
            value: 'back'
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
    const handleDocSectionSelect = (item) => {
        if (item.value === 'back') {
            setActiveScreen('MENU');
        }
        else {
            setDocsSection(item.value);
        }
    };
    const generateApiKey = () => {
        setIsGeneratingKey(true);
        // Simulate API key generation
        setTimeout(() => {
            const newKey = {
                id: `key${apiKeys.length + 1}`,
                name: `API Key ${apiKeys.length + 1}`,
                key: 'brp_' + Math.random().toString(36).substring(2, 10) + '_' + Math.random().toString(36).substring(2, 10),
                created: new Date().toISOString(),
                lastUsed: null,
                callsMade: 0,
                status: 'ACTIVE'
            };
            setApiKeys([...apiKeys, newKey]);
            setIsGeneratingKey(false);
        }, 2000);
    };
    const toggleKeyStatus = (keyId) => {
        setApiKeys(prev => prev.map(key => {
            if (key.id === keyId) {
                return {
                    ...key,
                    status: key.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE'
                };
            }
            return key;
        }));
    };
    const installApp = (appId) => {
        // In a real app, this would redirect to authentication flow
        // For the simulator, we'll just mark it as successful
        alert(`Installing app: ${thirdPartyApps.find(app => app.id === appId)?.name}`);
    };
    // Main menu screen
    const renderMenuScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "RIP-API: BROIP Developer Platform")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Build third-party applications that integrate with the BROIP protocol")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Active API Keys: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, apiKeys.filter(k => k.status === 'ACTIVE').length)),
            react_1.default.createElement(ink_1.Text, null,
                "Approved Applications: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "blue" }, thirdPartyApps.filter(a => a.status === 'APPROVED').length)),
            react_1.default.createElement(ink_1.Text, null,
                "API Version: ",
                react_1.default.createElement(ink_1.Text, { bold: true, color: "yellow" }, "v1.0.0"))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
    // Documentation screen
    const renderDocsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "RIP-API Documentation")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_select_input_1.default, { items: docSectionItems, onSelect: handleDocSectionSelect })),
        docsSection === 'OVERVIEW' && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "BROIP API Overview"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, "The BROIP API allows developers to programmatically interact with the Bong Rip Over IP protocol. You can create and manage rip sessions, analyze terpene profiles, monitor HARN nodes, and more.")),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Base URL:"),
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "https://api.broipprotocol.io")),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Rate Limits:"),
                react_1.default.createElement(ink_1.Text, null, "\u2022 Free tier: 100 requests/hour"),
                react_1.default.createElement(ink_1.Text, null, "\u2022 Developer tier: 1,000 requests/hour"),
                react_1.default.createElement(ink_1.Text, null, "\u2022 Enterprise tier: 10,000 requests/hour")),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Data Formats:"),
                react_1.default.createElement(ink_1.Text, null, "All API endpoints accept and return JSON data.")))),
        docsSection === 'ENDPOINTS' && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Available Endpoints"),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 }, endpoints.map(endpoint => (react_1.default.createElement(ink_1.Box, { key: endpoint.id, flexDirection: "column", borderStyle: selectedEndpoint === endpoint.id ? "double" : "single", borderColor: endpoint.method === 'GET' ? "green" :
                    endpoint.method === 'POST' ? "yellow" :
                        endpoint.method === 'PUT' ? "blue" : "red", paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedEndpoint(selectedEndpoint === endpoint.id ? null : endpoint.id) },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { backgroundColor: endpoint.method === 'GET' ? "green" :
                            endpoint.method === 'POST' ? "yellow" :
                                endpoint.method === 'PUT' ? "blue" : "red", color: "black", paddingX: 1 }, endpoint.method),
                    react_1.default.createElement(ink_1.Text, null, " "),
                    react_1.default.createElement(ink_1.Text, null, endpoint.path)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null, endpoint.description)),
                selectedEndpoint === endpoint.id && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, { bold: true }, "Parameters:"),
                        endpoint.parameters.map((param, index) => (react_1.default.createElement(ink_1.Text, { key: index },
                            "- ",
                            param.name,
                            " ",
                            react_1.default.createElement(ink_1.Text, { color: "cyan" },
                                "(",
                                param.type,
                                ")"),
                            param.required ? react_1.default.createElement(ink_1.Text, { color: "red" }, " [required]") : '',
                            ": ",
                            param.description)))),
                    react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, { bold: true }, "Response Example:"),
                        react_1.default.createElement(ink_1.Text, { color: "yellow" }, endpoint.responseExample)),
                    react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                        react_1.default.createElement(ink_1.Text, null,
                            "Authentication: ",
                            endpoint.authed ? 'Required' : 'Not Required'),
                        react_1.default.createElement(ink_1.Text, null,
                            "Rate Limit: ",
                            endpoint.rateLimit,
                            " requests/minute")))))))))),
        docsSection === 'AUTHENTICATION' && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Authentication Guide"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, null, "The BROIP API uses API keys for authentication. Include your API key in the request headers as follows:")),
            react_1.default.createElement(ink_1.Box, { marginY: 1, paddingX: 2 },
                react_1.default.createElement(ink_1.Text, { color: "cyan" }, "Authorization: Bearer <YOUR_API_KEY>")),
            react_1.default.createElement(ink_1.Text, null, "Replace <YOUR_API_KEY> with one of your generated keys."))),
        docsSection === 'EXAMPLES' && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Code Examples"),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Using cURL"),
                react_1.default.createElement(ink_1.Box, { marginY: 1, paddingX: 2 },
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "curl -X GET 'https://api.broip.net/api/v1/sessions/sess_1a2b3c4d' \\"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "  -H 'Authorization: Bearer YOUR_API_KEY'"))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Using Python (requests library)"),
                react_1.default.createElement(ink_1.Box, { marginY: 1, paddingX: 2, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "import requests"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "api_key = 'YOUR_API_KEY'"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" },
                        "headers = ",
                        {}),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" },
                        "    'Authorization': f'Bearer ",
                        api_key,
                        "'"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "}}"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "response = requests.get('https://api.broip.net/api/v1/sessions/sess_1a2b3c4d', headers=headers)"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "print(response.json())"))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Using JavaScript (fetch)"),
                react_1.default.createElement(ink_1.Box, { marginY: 1, paddingX: 2, flexDirection: "column" },
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "const apiKey = 'YOUR_API_KEY';"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" },
                        "fetch('https://api.broip.net/api/v1/sessions/sess_1a2b3c4d', ",
                        {}),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "  method: 'GET',"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" },
                        "  headers: ",
                        {}),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" },
                        "    'Authorization': `Bearer $",
                        apiKey,
                        "`"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "  }}"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "}})"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, ".then(response => response.json())"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, ".then(data => console.log(data))"),
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, ".catch(error => console.error('Error:', error));"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { paddingX: 2, paddingY: 1, borderStyle: "single", borderColor: "yellow", onPress: () => setActiveScreen('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u21A9\uFE0F Back to API Menu")))));
    // API Keys screen
    const renderKeysScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Manage API Keys")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Generate, view, and revoke API keys for accessing the RIP-API.")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Box, { paddingX: 2, paddingY: 1, borderStyle: "single", borderColor: "cyan", onPress: generateApiKey, isDisabled: isGeneratingKey }, isGeneratingKey ? react_1.default.createElement(ink_spinner_1.default, { type: "dots" }) : react_1.default.createElement(ink_1.Text, { color: "cyan" }, "\u2728 Generate New Key"))),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1, borderStyle: "round", padding: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Your API Keys (",
                apiKeys.length,
                ")"),
            apiKeys.map(apiKey => (react_1.default.createElement(ink_1.Box, { key: apiKey.id, marginY: 1, padding: 1, borderStyle: "single", flexDirection: "column" },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, apiKey.name),
                    react_1.default.createElement(ink_1.Text, null, " ("),
                    react_1.default.createElement(ink_1.Text, { color: apiKey.status === 'ACTIVE' ? "green" : "red" }, apiKey.status),
                    react_1.default.createElement(ink_1.Text, null, ")")),
                react_1.default.createElement(ink_1.Text, { selectable: true, color: "gray" },
                    "Key: ",
                    apiKey.key),
                react_1.default.createElement(ink_1.Text, null,
                    "Created: ",
                    new Date(apiKey.created).toLocaleString()),
                react_1.default.createElement(ink_1.Text, null,
                    "Last Used: ",
                    apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleString() : 'Never'),
                react_1.default.createElement(ink_1.Text, null,
                    "Calls Made: ",
                    apiKey.callsMade),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { paddingX: 1, borderStyle: "single", borderColor: apiKey.status === 'ACTIVE' ? 'red' : 'green', onPress: () => toggleKeyStatus(apiKey.id) },
                        react_1.default.createElement(ink_1.Text, { color: apiKey.status === 'ACTIVE' ? 'red' : 'green' }, apiKey.status === 'ACTIVE' ? 'Revoke' : 'Activate'))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { paddingX: 2, paddingY: 1, borderStyle: "single", borderColor: "yellow", onPress: () => setActiveScreen('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u21A9\uFE0F Back to API Menu")))));
    // Third-party apps screen
    const renderAppsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Third-Party Applications")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Discover and manage third-party apps integrated with BROIP.")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1, borderStyle: "round", padding: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Approved Applications (",
                thirdPartyApps.filter(app => app.status === 'APPROVED').length,
                ")"),
            thirdPartyApps.filter(app => app.status === 'APPROVED').map(app => (react_1.default.createElement(ink_1.Box, { key: app.id, marginY: 1, padding: 1, borderStyle: "single", flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, { bold: true }, app.name),
                react_1.default.createElement(ink_1.Text, null,
                    "Developer: ",
                    app.developer),
                react_1.default.createElement(ink_1.Text, null,
                    "Description: ",
                    app.description),
                react_1.default.createElement(ink_1.Text, null,
                    "Website: ",
                    react_1.default.createElement(ink_1.Text, { color: "blue", underline: true }, app.website)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Box, { paddingX: 1, borderStyle: "single", borderColor: "blue", onPress: () => installApp(app.id) },
                        react_1.default.createElement(ink_1.Text, { color: "blue" }, "Visit/Install"))))))),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1, borderStyle: "round", padding: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true },
                "Pending Applications (",
                thirdPartyApps.filter(app => app.status === 'PENDING').length,
                ")"),
            thirdPartyApps.filter(app => app.status === 'PENDING').map(app => (react_1.default.createElement(ink_1.Box, { key: app.id, marginY: 1, padding: 1, borderStyle: "single", flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, { bold: true }, app.name),
                react_1.default.createElement(ink_1.Text, null,
                    "Developer: ",
                    app.developer),
                react_1.default.createElement(ink_1.Text, null,
                    "Description: ",
                    app.description),
                react_1.default.createElement(ink_1.Text, null,
                    "Website: ",
                    react_1.default.createElement(ink_1.Text, { color: "blue", underline: true }, app.website)),
                react_1.default.createElement(ink_1.Text, { color: "gray" }, "(Awaiting approval)"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { paddingX: 2, paddingY: 1, borderStyle: "single", borderColor: "yellow", onPress: () => setActiveScreen('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u21A9\uFE0F Back to API Menu")))));
    // Playground screen (Simplified)
    const renderPlaygroundScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "API Playground")),
        react_1.default.createElement(ink_1.Text, null, "Experiment with API endpoints in a safe environment. (Coming Soon!)"),
        react_1.default.createElement(ink_1.Box, { marginY: 1 },
            react_1.default.createElement(ink_select_input_1.default, { items: endpoints.map(ep => ({ label: `${ep.method} ${ep.path}`, value: ep.id })), onSelect: item => setSelectedEndpoint(item.value) })),
        selectedEndpoint && (react_1.default.createElement(ink_1.Box, { marginY: 1, borderStyle: "single", padding: 1, flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Selected Endpoint:"),
            react_1.default.createElement(ink_1.Text, null, endpoints.find(ep => ep.id === selectedEndpoint)?.name),
            react_1.default.createElement(ink_1.Text, null,
                "Path: ",
                endpoints.find(ep => ep.id === selectedEndpoint)?.path),
            react_1.default.createElement(ink_1.Text, { marginTop: 1 }, "Parameters, request body, and response would go here..."))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { paddingX: 2, paddingY: 1, borderStyle: "single", borderColor: "yellow", onPress: () => setActiveScreen('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u21A9\uFE0F Back to API Menu")))));
    if (activeScreen === 'DOCS') {
        return renderDocsScreen();
    }
    if (activeScreen === 'KEYS') {
        return renderKeysScreen();
    }
    if (activeScreen === 'APPS') {
        return renderAppsScreen();
    }
    if (activeScreen === 'PLAYGROUND') {
        return renderPlaygroundScreen();
    }
    return renderMenuScreen();
};
exports.default = RipAPI;

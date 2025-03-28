import React, { useState } from 'react';
import { Box, Text } from './common';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface RipAPIProps {
    onReturn: () => void;
}

interface Endpoint {
    id: string;
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    parameters: {
        name: string;
        type: string;
        required: boolean;
        description: string;
    }[];
    responseExample: string;
    authed: boolean;
    rateLimit: number;
}

interface ApiKey {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string | null;
    callsMade: number;
    status: 'ACTIVE' | 'REVOKED';
}

interface ThirdPartyApp {
    id: string;
    name: string;
    description: string;
    developer: string;
    website: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    installUrl: string;
}

const RipAPI: React.FC<RipAPIProps> = ({ onReturn }) => {
    const { preferences } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'DOCS' | 'KEYS' | 'APPS' | 'PLAYGROUND'>('MENU');
    const [docsSection, setDocsSection] = useState<'OVERVIEW' | 'ENDPOINTS' | 'AUTHENTICATION' | 'EXAMPLES'>('OVERVIEW');
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([
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
    const [thirdPartyApps, setThirdPartyApps] = useState<ThirdPartyApp[]>([
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
    
    const endpoints: Endpoint[] = [
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
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else {
            setActiveScreen(item.value as 'DOCS' | 'KEYS' | 'APPS' | 'PLAYGROUND');
        }
    };
    
    const handleDocSectionSelect = (item: { label: string; value: string }) => {
        if (item.value === 'back') {
            setActiveScreen('MENU');
        } else {
            setDocsSection(item.value as 'OVERVIEW' | 'ENDPOINTS' | 'AUTHENTICATION' | 'EXAMPLES');
        }
    };
    
    const generateApiKey = () => {
        setIsGeneratingKey(true);
        
        // Simulate API key generation
        setTimeout(() => {
            const newKey: ApiKey = {
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
    
    const toggleKeyStatus = (keyId: string) => {
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
    
    const installApp = (appId: string) => {
        // In a real app, this would redirect to authentication flow
        // For the simulator, we'll just mark it as successful
        alert(`Installing app: ${thirdPartyApps.find(app => app.id === appId)?.name}`);
    };
    
    // Main menu screen
    const renderMenuScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">RIP-API: BROIP Developer Platform</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Build third-party applications that integrate with the BROIP protocol</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Text>Active API Keys: <Text bold color="green">
                    {apiKeys.filter(k => k.status === 'ACTIVE').length}
                </Text></Text>
                <Text>Approved Applications: <Text bold color="blue">
                    {thirdPartyApps.filter(a => a.status === 'APPROVED').length}
                </Text></Text>
                <Text>API Version: <Text bold color="yellow">v1.0.0</Text></Text>
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );
    
    // Documentation screen
    const renderDocsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">RIP-API Documentation</Text>
            </Box>
            
            <Box marginBottom={1}>
                <SelectInput items={docSectionItems} onSelect={handleDocSectionSelect} />
            </Box>
            
            {docsSection === 'OVERVIEW' && (
                <Box flexDirection="column" marginY={1} borderStyle="single" paddingX={2} paddingY={1}>
                    <Text bold>BROIP API Overview</Text>
                    <Box marginY={1}>
                        <Text>The BROIP API allows developers to programmatically interact with the Bong Rip Over IP protocol. You can create and manage rip sessions, analyze terpene profiles, monitor HARN nodes, and more.</Text>
                    </Box>
                    <Box marginY={1}>
                        <Text bold>Base URL:</Text>
                        <Text color="yellow">https://api.broipprotocol.io</Text>
                    </Box>
                    <Box marginY={1}>
                        <Text bold>Rate Limits:</Text>
                        <Text>• Free tier: 100 requests/hour</Text>
                        <Text>• Developer tier: 1,000 requests/hour</Text>
                        <Text>• Enterprise tier: 10,000 requests/hour</Text>
                    </Box>
                    <Box marginY={1}>
                        <Text bold>Data Formats:</Text>
                        <Text>All API endpoints accept and return JSON data.</Text>
                    </Box>
                </Box>
            )}
            
            {docsSection === 'ENDPOINTS' && (
                <Box flexDirection="column" marginY={1}>
                    <Text bold>Available Endpoints</Text>
                    <Box flexDirection="column" marginY={1}>
                        {endpoints.map(endpoint => (
                            <Box 
                                key={endpoint.id}
                                flexDirection="column"
                                borderStyle={selectedEndpoint === endpoint.id ? "double" : "single"}
                                borderColor={
                                    endpoint.method === 'GET' ? "green" :
                                    endpoint.method === 'POST' ? "yellow" :
                                    endpoint.method === 'PUT' ? "blue" : "red"
                                }
                                paddingX={2}
                                paddingY={1}
                                marginBottom={1}
                                onPress={() => setSelectedEndpoint(
                                    selectedEndpoint === endpoint.id ? null : endpoint.id
                                )}
                            >
                                <Box>
                                    <Text 
                                        backgroundColor={
                                            endpoint.method === 'GET' ? "green" :
                                            endpoint.method === 'POST' ? "yellow" :
                                            endpoint.method === 'PUT' ? "blue" : "red"
                                        }
                                        color="black"
                                        paddingX={1}
                                    >
                                        {endpoint.method}
                                    </Text>
                                    <Text> </Text>
                                    <Text>{endpoint.path}</Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text>{endpoint.description}</Text>
                                </Box>
                                
                                {selectedEndpoint === endpoint.id && (
                                    <>
                                        <Box marginTop={1} flexDirection="column">
                                            <Text bold>Parameters:</Text>
                                            {endpoint.parameters.map((param, index) => (
                                                <Text key={index}>
                                                    - {param.name} <Text color="cyan">({param.type})</Text>
                                                    {param.required ? <Text color="red"> [required]</Text> : ''}
                                                    : {param.description}
                                                </Text>
                                            ))}
                                        </Box>
                                        
                                        <Box marginTop={1} flexDirection="column">
                                            <Text bold>Response Example:</Text>
                                            <Text color="yellow">{endpoint.responseExample}</Text>
                                        </Box>
                                        
                                        <Box marginTop={1}>
                                            <Text>Authentication: {endpoint.authed ? 'Required' : 'Not Required'}</Text>
                                            <Text>Rate Limit: {endpoint.rateLimit} requests/minute</Text>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
            
            {docsSection === 'AUTHENTICATION' && (
                <Box flexDirection="column" marginY={1} borderStyle="single" paddingX={2} paddingY={1}>
                    <Text bold>Authentication Guide</Text>
                    <Box marginY={1}>
                        <Text>The BROIP API uses API keys for authentication. Include your API key in the request headers as follows:</Text>
                    </Box>
                    <Box marginY={1} paddingX={2}>
                        <Text color="cyan">Authorization: Bearer &lt;YOUR_API_KEY&gt;</Text>
                    </Box>
                    <Text>Replace &lt;YOUR_API_KEY&gt; with one of your generated keys.</Text>
                </Box>
            )}
            
            {docsSection === 'EXAMPLES' && (
                <Box flexDirection="column" marginY={1} borderStyle="single" paddingX={2} paddingY={1}>
                    <Text bold>Code Examples</Text>
                    
                    <Box marginY={1}>
                        <Text bold>Using cURL</Text>
                        <Box marginY={1} paddingX={2}>
                            <Text color="cyan">curl -X GET 'https://api.broip.net/api/v1/sessions/sess_1a2b3c4d' \</Text>
                            <Text color="cyan">  -H 'Authorization: Bearer YOUR_API_KEY'</Text>
                        </Box>
                    </Box>
                    
                    <Box marginY={1}>
                        <Text bold>Using Python (requests library)</Text>
                        <Box marginY={1} paddingX={2} flexDirection="column">
                            <Text color="cyan">import requests</Text>
                            <Text color="cyan">api_key = 'YOUR_API_KEY'</Text>
                            <Text color="cyan">headers = {`{`}</Text>
                            <Text color="cyan">    'Authorization': f'Bearer {`{api_key}`}'</Text>
                            <Text color="cyan">{`}`}</Text>
                            <Text color="cyan">response = requests.get('https://api.broip.net/api/v1/sessions/sess_1a2b3c4d', headers=headers)</Text>
                            <Text color="cyan">print(response.json())</Text>
                        </Box>
                    </Box>
                    
                    <Box marginY={1}>
                        <Text bold>Using JavaScript (fetch)</Text>
                        <Box marginY={1} paddingX={2} flexDirection="column">
                            <Text color="cyan">const apiKey = 'YOUR_API_KEY';</Text>
                            <Text color="cyan">fetch('https://api.broip.net/api/v1/sessions/sess_1a2b3c4d', {`{`}</Text>
                            <Text color="cyan">  method: 'GET',</Text>
                            <Text color="cyan">  headers: {`{`}</Text>
                            <Text color="cyan">    'Authorization': `Bearer ${`{apiKey}`}`</Text>
                            <Text color="cyan">  {`}`}</Text>
                            <Text color="cyan">{`}`})</Text>
                            <Text color="cyan">.then(response {`=>`} response.json())</Text>
                            <Text color="cyan">.then(data {`=>`} console.log(data))</Text>
                            <Text color="cyan">.catch(error {`=>`} console.error('Error:', error));</Text>
                        </Box>
                    </Box>
                </Box>
            )}

            <Box marginTop={2}>
                <Box 
                    paddingX={2} 
                    paddingY={1} 
                    borderStyle="single"
                    borderColor="yellow"
                    onPress={() => setActiveScreen('MENU')}
                >
                    <Text color="yellow">↩️ Back to API Menu</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // API Keys screen
    const renderKeysScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Manage API Keys</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Generate, view, and revoke API keys for accessing the RIP-API.</Text>
            </Box>

            <Box marginBottom={1}>
                <Box 
                    paddingX={2} 
                    paddingY={1}
                    borderStyle="single"
                    borderColor="cyan"
                    onPress={generateApiKey}
                    isDisabled={isGeneratingKey}
                >
                    {isGeneratingKey ? <Spinner type="dots" /> : <Text color="cyan">✨ Generate New Key</Text>}
                </Box>
            </Box>

            <Box flexDirection="column" marginY={1} borderStyle="round" padding={1}>
                <Text bold>Your API Keys ({apiKeys.length})</Text>
                {apiKeys.map(apiKey => (
                    <Box key={apiKey.id} marginY={1} padding={1} borderStyle="single" flexDirection="column">
                        <Box>
                            <Text bold>{apiKey.name}</Text>
                            <Text> (</Text>
                            <Text color={apiKey.status === 'ACTIVE' ? "green" : "red"}>{apiKey.status}</Text>
                            <Text>)</Text>
                        </Box>
                        <Text selectable color="gray">Key: {apiKey.key}</Text>
                        <Text>Created: {new Date(apiKey.created).toLocaleString()}</Text>
                        <Text>Last Used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleString() : 'Never'}</Text>
                        <Text>Calls Made: {apiKey.callsMade}</Text>
                        <Box marginTop={1}>
                            <Box 
                                paddingX={1} 
                                borderStyle="single" 
                                borderColor={apiKey.status === 'ACTIVE' ? 'red' : 'green'}
                                onPress={() => toggleKeyStatus(apiKey.id)}
                            >
                                <Text color={apiKey.status === 'ACTIVE' ? 'red' : 'green'}>
                                    {apiKey.status === 'ACTIVE' ? 'Revoke' : 'Activate'}
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box marginTop={2}>
                <Box 
                    paddingX={2} 
                    paddingY={1} 
                    borderStyle="single"
                    borderColor="yellow"
                    onPress={() => setActiveScreen('MENU')}
                >
                    <Text color="yellow">↩️ Back to API Menu</Text>
                </Box>
            </Box>
        </Box>
    );

    // Third-party apps screen
    const renderAppsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Third-Party Applications</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Discover and manage third-party apps integrated with BROIP.</Text>
            </Box>

            <Box flexDirection="column" marginY={1} borderStyle="round" padding={1}>
                <Text bold>Approved Applications ({thirdPartyApps.filter(app => app.status === 'APPROVED').length})</Text>
                {thirdPartyApps.filter(app => app.status === 'APPROVED').map(app => (
                    <Box key={app.id} marginY={1} padding={1} borderStyle="single" flexDirection="column">
                        <Text bold>{app.name}</Text>
                        <Text>Developer: {app.developer}</Text>
                        <Text>Description: {app.description}</Text>
                        <Text>Website: <Text color="blue" underline>{app.website}</Text></Text>
                        <Box marginTop={1}>
                            <Box 
                                paddingX={1} 
                                borderStyle="single" 
                                borderColor="blue"
                                onPress={() => installApp(app.id)} // Assuming installApp opens a URL or similar
                            >
                                <Text color="blue">Visit/Install</Text>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
            
            <Box flexDirection="column" marginY={1} borderStyle="round" padding={1}>
                <Text bold>Pending Applications ({thirdPartyApps.filter(app => app.status === 'PENDING').length})</Text>
                {thirdPartyApps.filter(app => app.status === 'PENDING').map(app => (
                    <Box key={app.id} marginY={1} padding={1} borderStyle="single" flexDirection="column">
                        <Text bold>{app.name}</Text>
                        <Text>Developer: {app.developer}</Text>
                        <Text>Description: {app.description}</Text>
                        <Text>Website: <Text color="blue" underline>{app.website}</Text></Text>
                        <Text color="gray">(Awaiting approval)</Text>
                    </Box>
                ))}
            </Box>

            <Box marginTop={2}>
                <Box 
                    paddingX={2} 
                    paddingY={1} 
                    borderStyle="single"
                    borderColor="yellow"
                    onPress={() => setActiveScreen('MENU')}
                >
                    <Text color="yellow">↩️ Back to API Menu</Text>
                </Box>
            </Box>
        </Box>
    );

    // Playground screen (Simplified)
    const renderPlaygroundScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">API Playground</Text>
            </Box>
            <Text>Experiment with API endpoints in a safe environment. (Coming Soon!)</Text>
            
            {/* Basic example: Selector for endpoints */}
            <Box marginY={1}>
                <SelectInput 
                    items={endpoints.map(ep => ({ label: `${ep.method} ${ep.path}`, value: ep.id }))} 
                    onSelect={item => setSelectedEndpoint(item.value)}
                />
            </Box>
            
            {selectedEndpoint && (
                <Box marginY={1} borderStyle="single" padding={1} flexDirection="column">
                    <Text bold>Selected Endpoint:</Text>
                    <Text>{endpoints.find(ep => ep.id === selectedEndpoint)?.name}</Text>
                    <Text>Path: {endpoints.find(ep => ep.id === selectedEndpoint)?.path}</Text>
                    <Text marginTop={1}>Parameters, request body, and response would go here...</Text>
                </Box>
            )}

            <Box marginTop={2}>
                <Box 
                    paddingX={2} 
                    paddingY={1} 
                    borderStyle="single"
                    borderColor="yellow"
                    onPress={() => setActiveScreen('MENU')}
                >
                    <Text color="yellow">↩️ Back to API Menu</Text>
                </Box>
            </Box>
        </Box>
    );

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

export default RipAPI;

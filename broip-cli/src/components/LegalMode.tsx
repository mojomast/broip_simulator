import React, { useState, useEffect } from 'react';
import { Box, Text } from './common';
import { useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { useUser } from '../utils/UserContext';

interface LegalModeProps {
    onReturn: () => void;
}

interface Region {
    id: string;
    name: string;
    status: 'LEGAL' | 'MEDICAL_ONLY' | 'PROHIBITED' | 'GRAY_AREA';
    restrictionLevel: number; // 0-10 scale, 10 being most restrictive
    requiredDocuments: string[];
    complianceTips: string[];
}

interface ComplianceSettings {
    enabled: boolean;
    geolocationTracking: boolean;
    anonymizationLevel: 'NONE' | 'BASIC' | 'MODERATE' | 'STRICT';
    filteredTerms: boolean;
    ageLock: boolean;
    termsAccepted: boolean;
    documentVerification: boolean;
}

interface ComplianceReport {
    timestamp: string;
    overallStatus: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendations: string[];
    missingRequirements: string[];
}

interface RiskAssessment {
    activity: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    legalImplications: string;
    recommendations: string;
}

interface ExportData {
    timestamp: string;
    region: Region;
    complianceSettings: ComplianceSettings;
    complianceReport: ComplianceReport;
    riskAssessments: RiskAssessment[];
}

const LegalMode: React.FC<LegalModeProps> = ({ onReturn }) => {
    const { preferences, updatePreferences } = useUser();
    const [activeScreen, setActiveScreen] = useState<'MENU' | 'REGIONS' | 'SETTINGS' | 'DOCUMENTS' | 'REPORT' | 'RISK_ASSESSMENT' | 'EXPORT'>('MENU');
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentRegion, setCurrentRegion] = useState<Region>({
        id: 'region3',
        name: 'Colorado, USA',
        status: 'LEGAL',
        restrictionLevel: 2,
        requiredDocuments: ['Age Verification'],
        complianceTips: [
            'Keep usage away from public spaces',
            'Do not operate vehicles under influence',
            'Store securely away from minors'
        ]
    });
    
    const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>({
        enabled: true,
        geolocationTracking: true,
        anonymizationLevel: 'MODERATE',
        filteredTerms: true,
        ageLock: true,
        termsAccepted: true,
        documentVerification: false
    });

    const [complianceReport, setComplianceReport] = useState<ComplianceReport>({
        timestamp: new Date().toISOString(),
        overallStatus: 'PARTIAL',
        riskLevel: 'MEDIUM',
        recommendations: [
            'Enable document verification for enhanced compliance',
            'Consider upgrading anonymization to STRICT level',
            'Review and accept latest terms and conditions'
        ],
        missingRequirements: [
            'Document verification not completed',
            'Anonymization level below recommended for region'
        ]
    });
    
    const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([
        {
            activity: 'Public Consumption',
            riskLevel: 'HIGH',
            legalImplications: 'Fines up to $500 in most legal regions, potential criminal charges in prohibited regions',
            recommendations: 'Only consume in private residences or designated consumption areas'
        },
        {
            activity: 'Possession Limits',
            riskLevel: 'MEDIUM',
            legalImplications: 'Exceeding limits can result in fines or misdemeanor charges',
            recommendations: 'Stay within regional limits (typically 1-2 oz for personal use)'
        },
        {
            activity: 'Cross-Border Transport',
            riskLevel: 'CRITICAL',
            legalImplications: 'Federal trafficking charges possible, international transport may result in severe penalties',
            recommendations: 'Never transport across state/country borders, even between legal regions'
        },
        {
            activity: 'Sharing with Minors',
            riskLevel: 'CRITICAL',
            legalImplications: 'Felony charges in all jurisdictions, mandatory minimums in many regions',
            recommendations: 'Never share with anyone under legal age (21+ in most regions)'
        },
        {
            activity: 'Medical Documentation',
            riskLevel: 'MEDIUM',
            legalImplications: 'Using without proper documentation in medical-only regions can result in possession charges',
            recommendations: 'Maintain current medical documentation in medical-only regions'
        }
    ]);
    
    const regions: Region[] = [
        {
            id: 'region1',
            name: 'Ontario, Canada',
            status: 'LEGAL',
            restrictionLevel: 3,
            requiredDocuments: ['Age Verification'],
            complianceTips: [
                'Public consumption may be restricted',
                'Purchase only from licensed retailers',
                'Keep usage away from schools and public spaces'
            ]
        },
        {
            id: 'region2',
            name: 'Amsterdam, Netherlands',
            status: 'GRAY_AREA',
            restrictionLevel: 4,
            requiredDocuments: ['Age Verification', 'Residency Card (for some venues)'],
            complianceTips: [
                'Consumption allowed in designated coffee shops',
                'Purchase limits may apply',
                'Avoid public consumption outside designated areas'
            ]
        },
        {
            id: 'region3',
            name: 'Colorado, USA',
            status: 'LEGAL',
            restrictionLevel: 2,
            requiredDocuments: ['Age Verification'],
            complianceTips: [
                'Keep usage away from public spaces',
                'Do not operate vehicles under influence',
                'Store securely away from minors'
            ]
        },
        {
            id: 'region4',
            name: 'Tokyo, Japan',
            status: 'PROHIBITED',
            restrictionLevel: 10,
            requiredDocuments: ['Medical Exception Documentation (rare)'],
            complianceTips: [
                'Strict criminal penalties for possession',
                'Medical exemptions extremely limited',
                'SIMULATION MODE ONLY recommended'
            ]
        },
        {
            id: 'region5',
            name: 'Berlin, Germany',
            status: 'MEDICAL_ONLY',
            restrictionLevel: 6,
            requiredDocuments: ['Medical Prescription', 'Patient ID Card'],
            complianceTips: [
                'Recreational use remains prohibited',
                'Medical documentation must be current',
                'Purchase only from authorized pharmacies'
            ]
        }
    ];
    
    const menuItems = [
        {
            label: '🌎 Change Region',
            value: 'regions'
        },
        {
            label: '⚙️ Compliance Settings',
            value: 'settings'
        },
        {
            label: '📄 Manage Documents',
            value: 'documents'
        },
        {
            label: '📊 Compliance Report',
            value: 'report'
        },
        {
            label: '⚠️ Risk Assessment',
            value: 'risk'
        },
        {
            label: '💾 Export Compliance Data',
            value: 'export'
        },
        {
            label: '↩️ Return to Main Menu',
            value: 'return'
        }
    ];
    
    const [exportData, setExportData] = useState<ExportData | null>(null);
    const [exportFormat, setExportFormat] = useState<'JSON' | 'TEXT'>('JSON');
    const [isExporting, setIsExporting] = useState(false);
    
    const handleMenuSelect = (item: { label: string; value: string }) => {
        if (item.value === 'return') {
            onReturn();
        } else if (item.value === 'risk') {
            setActiveScreen('RISK_ASSESSMENT');
        } else if (item.value === 'export') {
            setActiveScreen('EXPORT');
            prepareExportData();
        } else {
            setActiveScreen(item.value as 'REGIONS' | 'SETTINGS' | 'DOCUMENTS' | 'REPORT');
        }
    };
    
    const changeRegion = (regionId: string) => {
        setIsLoading(true);
        
        // Simulate location change and compliance check
        setTimeout(() => {
            const region = regions.find(r => r.id === regionId);
            if (region) {
                setCurrentRegion(region);
                
                // Auto-adjust compliance settings based on region
                setComplianceSettings(prev => ({
                    ...prev,
                    anonymizationLevel: 
                        region.restrictionLevel >= 8 ? 'STRICT' :
                        region.restrictionLevel >= 5 ? 'MODERATE' :
                        region.restrictionLevel >= 3 ? 'BASIC' : 'NONE',
                    filteredTerms: region.restrictionLevel >= 5,
                    documentVerification: region.restrictionLevel >= 7
                }));
                
                // Update risk assessments based on current region
                const updatedAssessments = [...riskAssessments];
                
                // Adjust risk levels based on current region
                updatedAssessments.forEach(assessment => {
                    // Public Consumption risk adjustment
                    if (assessment.activity === 'Public Consumption') {
                        if (region.status === 'PROHIBITED') {
                            assessment.riskLevel = 'CRITICAL';
                            assessment.legalImplications = 'Criminal charges likely, potential imprisonment';
                        } else if (region.status === 'MEDICAL_ONLY') {
                            assessment.riskLevel = 'HIGH';
                            assessment.legalImplications = 'Fines and potential criminal charges, medical card may not protect public use';
                        } else if (region.status === 'LEGAL') {
                            assessment.riskLevel = 'MEDIUM';
                            assessment.legalImplications = 'Fines up to $500 in most legal regions, similar to public alcohol consumption';
                        }
                    }
                    
                    // Possession Limits risk adjustment
                    if (assessment.activity === 'Possession Limits') {
                        if (region.status === 'PROHIBITED') {
                            assessment.riskLevel = 'CRITICAL';
                            assessment.legalImplications = 'Any possession is illegal, criminal charges likely';
                        } else if (region.status === 'MEDICAL_ONLY') {
                            assessment.riskLevel = 'HIGH';
                            assessment.legalImplications = 'Exceeding medical limits can result in trafficking charges';
                        }
                    }
                    
                    // Medical Documentation risk adjustment
                    if (assessment.activity === 'Medical Documentation') {
                        if (region.status === 'PROHIBITED') {
                            assessment.riskLevel = 'HIGH';
                            assessment.legalImplications = 'Medical documentation may not provide legal protection';
                        } else if (region.status === 'LEGAL') {
                            assessment.riskLevel = 'LOW';
                            assessment.legalImplications = 'Documentation not required for adults over legal age';
                        }
                    }
                });
                
                setRiskAssessments(updatedAssessments);
            }
            
            setIsLoading(false);
            setSelectedRegion(null);
        }, 2000);
    };
    
    const toggleSetting = (setting: keyof ComplianceSettings) => {
        if (setting === 'enabled') {
            if (complianceSettings.enabled === false) {
                // Show warning when enabling legal mode
                if (confirm('Enabling Legal Mode will apply regional restrictions and compliance measures. Continue?')) {
                    setComplianceSettings(prev => ({
                        ...prev,
                        enabled: !prev.enabled
                    }));
                }
            } else {
                // Show stronger warning when disabling legal mode
                if (confirm('⚠️ WARNING: Disabling Legal Mode may violate local regulations in your region. You assume all legal responsibility for compliance. Continue?')) {
                    setComplianceSettings(prev => ({
                        ...prev,
                        enabled: !prev.enabled
                    }));
                }
            }
        } else {
            setComplianceSettings(prev => ({
                ...prev,
                [setting]: !prev[setting as keyof ComplianceSettings]
            }));
        }
    };
    
    const changeAnonymizationLevel = (level: ComplianceSettings['anonymizationLevel']) => {
        setComplianceSettings(prev => ({
            ...prev,
            anonymizationLevel: level
        }));
    };
    
    const getStatusColor = (status: Region['status']): string => {
        switch (status) {
            case 'LEGAL': return 'green';
            case 'MEDICAL_ONLY': return 'blue';
            case 'GRAY_AREA': return 'yellow';
            case 'PROHIBITED': return 'red';
        }
    };
    
    const getRestrictionLevelBar = (level: number): string => {
        const full = '█';
        const empty = '░';
        return Array(10).fill(empty).map((char, i) => i < level ? full : char).join('');
    };
    
    const getAnonymizationDescription = (level: ComplianceSettings['anonymizationLevel']): string => {
        switch (level) {
            case 'NONE':
                return 'No anonymization. All data is stored with real identifiers.';
            case 'BASIC':
                return 'Basic anonymization. Username and location generalized.';
            case 'MODERATE':
                return 'Moderate anonymization. All personal data hashed, usage metadata partially obscured.';
            case 'STRICT':
                return 'Strict anonymization. Fully anonymous mode with no personally identifiable data stored.';
        }
    };
    
    // Generate a new compliance report based on current settings and region
    const generateComplianceReport = () => {
        setIsLoading(true);
        
        // Simulate report generation
        setTimeout(() => {
            // Calculate overall compliance status
            const missingRequirements: string[] = [];
            
            if (!complianceSettings.documentVerification && currentRegion.requiredDocuments.length > 0) {
                missingRequirements.push('Document verification not completed');
            }
            
            if (currentRegion.restrictionLevel >= 8 && complianceSettings.anonymizationLevel !== 'STRICT') {
                missingRequirements.push('Anonymization level below recommended for region');
            }
            
            if (currentRegion.restrictionLevel >= 5 && !complianceSettings.filteredTerms) {
                missingRequirements.push('Filtered terminology disabled in restricted region');
            }
            
            if (!complianceSettings.ageLock) {
                missingRequirements.push('Age verification disabled');
            }
            
            // Generate recommendations
            const recommendations: string[] = [];
            
            if (!complianceSettings.documentVerification) {
                recommendations.push('Enable document verification for enhanced compliance');
            }
            
            if (complianceSettings.anonymizationLevel !== 'STRICT') {
                recommendations.push('Consider upgrading anonymization to STRICT level');
            }
            
            if (!complianceSettings.geolocationTracking) {
                recommendations.push('Enable geolocation tracking for automatic compliance updates');
            }
            
            // Determine overall status and risk level
            let overallStatus: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
            let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
            
            if (missingRequirements.length === 0) {
                overallStatus = 'COMPLIANT';
                riskLevel = 'LOW';
            } else if (missingRequirements.length <= 2) {
                overallStatus = 'PARTIAL';
                riskLevel = currentRegion.restrictionLevel >= 8 ? 'HIGH' : 'MEDIUM';
            } else {
                overallStatus = 'NON_COMPLIANT';
                riskLevel = currentRegion.status === 'PROHIBITED' ? 'CRITICAL' : 'HIGH';
            }
            
            setComplianceReport({
                timestamp: new Date().toISOString(),
                overallStatus,
                riskLevel,
                recommendations,
                missingRequirements
            });
            
            setIsLoading(false);
        }, 1500);
    };
    
    // Update risk assessments based on current region
    const updateRiskAssessments = () => {
        const updatedAssessments = [...riskAssessments];
        
        // Adjust risk levels based on current region
        updatedAssessments.forEach(assessment => {
            // Public Consumption risk adjustment
            if (assessment.activity === 'Public Consumption') {
                if (currentRegion.status === 'PROHIBITED') {
                    assessment.riskLevel = 'CRITICAL';
                    assessment.legalImplications = 'Criminal charges likely, potential imprisonment';
                } else if (currentRegion.status === 'MEDICAL_ONLY') {
                    assessment.riskLevel = 'HIGH';
                    assessment.legalImplications = 'Fines and potential criminal charges, medical card may not protect public use';
                } else if (currentRegion.status === 'LEGAL') {
                    assessment.riskLevel = 'MEDIUM';
                    assessment.legalImplications = 'Fines up to $500 in most legal regions, similar to public alcohol consumption';
                }
            }
            
            // Possession Limits risk adjustment
            if (assessment.activity === 'Possession Limits') {
                if (currentRegion.status === 'PROHIBITED') {
                    assessment.riskLevel = 'CRITICAL';
                    assessment.legalImplications = 'Any possession is illegal, criminal charges likely';
                } else if (currentRegion.status === 'MEDICAL_ONLY') {
                    assessment.riskLevel = 'HIGH';
                    assessment.legalImplications = 'Exceeding medical limits can result in trafficking charges';
                }
            }
            
            // Medical Documentation risk adjustment
            if (assessment.activity === 'Medical Documentation') {
                if (currentRegion.status === 'PROHIBITED') {
                    assessment.riskLevel = 'HIGH';
                    assessment.legalImplications = 'Medical documentation may not provide legal protection';
                } else if (currentRegion.status === 'LEGAL') {
                    assessment.riskLevel = 'LOW';
                    assessment.legalImplications = 'Documentation not required for adults over legal age';
                }
            }
        });
        
        setRiskAssessments(updatedAssessments);
    };
    
    // Prepare data for export
    const prepareExportData = () => {
        setIsExporting(true);
        
        // Simulate export preparation
        setTimeout(() => {
            const data: ExportData = {
                timestamp: new Date().toISOString(),
                region: currentRegion,
                complianceSettings,
                complianceReport,
                riskAssessments
            };
            
            setExportData(data);
            setIsExporting(false);
        }, 1000);
    };
    
    // Format export data as JSON
    const formatAsJSON = (): string => {
        if (!exportData) return '';
        
        return JSON.stringify(exportData, null, 2);
    };
    
    // Format export data as human-readable text
    const formatAsText = (): string => {
        if (!exportData) return '';
        
        const { timestamp, region, complianceSettings, complianceReport, riskAssessments } = exportData;
        
        let text = `BROIP COMPLIANCE REPORT\n`;
        text += `Generated: ${new Date(timestamp).toLocaleString()}\n\n`;
        
        text += `REGION INFORMATION\n`;
        text += `Name: ${region.name}\n`;
        text += `Status: ${region.status}\n`;
        text += `Restriction Level: ${region.restrictionLevel}/10\n\n`;
        
        text += `COMPLIANCE SETTINGS\n`;
        text += `Legal Mode: ${complianceSettings.enabled ? 'ENABLED' : 'DISABLED'}\n`;
        text += `Geolocation Tracking: ${complianceSettings.geolocationTracking ? 'ENABLED' : 'DISABLED'}\n`;
        text += `Anonymization Level: ${complianceSettings.anonymizationLevel}\n`;
        text += `Filtered Terms: ${complianceSettings.filteredTerms ? 'ENABLED' : 'DISABLED'}\n`;
        text += `Age Lock: ${complianceSettings.ageLock ? 'ENABLED' : 'DISABLED'}\n`;
        text += `Document Verification: ${complianceSettings.documentVerification ? 'ENABLED' : 'DISABLED'}\n\n`;
        
        text += `COMPLIANCE REPORT\n`;
        text += `Overall Status: ${complianceReport.overallStatus}\n`;
        text += `Risk Level: ${complianceReport.riskLevel}\n`;
        
        if (complianceReport.missingRequirements.length > 0) {
            text += `\nMissing Requirements:\n`;
            complianceReport.missingRequirements.forEach(req => {
                text += `• ${req}\n`;
            });
        }
        
        text += `\nRecommendations:\n`;
        complianceReport.recommendations.forEach(rec => {
            text += `• ${rec}\n`;
        });
        
        text += `\nRISK ASSESSMENT\n`;
        riskAssessments.forEach(assessment => {
            text += `\n${assessment.activity} - ${assessment.riskLevel} RISK\n`;
            text += `Legal Implications: ${assessment.legalImplications}\n`;
            text += `Recommendations: ${assessment.recommendations}\n`;
        });
        
        return text;
    };
    
    // Export the data
    const exportCompliance = () => {
        // In a real app, this would save to a file
        // For this simulation, we'll just log to console
        console.log(exportFormat === 'JSON' ? formatAsJSON() : formatAsText());
        
        // Simulate successful export
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            // In a real app, this would show a success message or download dialog
        }, 1500);
    };
    
    // Main menu screen
    const renderMenuScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Legal Mode: Compliance Settings</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Adjust settings to comply with local regulations</Text>
            </Box>
            
            <Box marginBottom={1} borderStyle="single" paddingX={2} paddingY={1}>
                <Box>
                    <Text>Legal Mode: </Text>
                    <Text bold color={complianceSettings.enabled ? 'green' : 'red'}>
                        {complianceSettings.enabled ? 'ENABLED' : 'DISABLED'}
                    </Text>
                </Box>
                <Box>
                    <Text>Current Region: </Text>
                    <Text bold>{currentRegion.name}</Text>
                    <Text> - </Text>
                    <Text color={getStatusColor(currentRegion.status)}>
                        {currentRegion.status.replace('_', ' ')}
                    </Text>
                </Box>
                <Box>
                    <Text>Restriction Level: </Text>
                    <Text>{getRestrictionLevelBar(currentRegion.restrictionLevel)} {currentRegion.restrictionLevel}/10</Text>
                </Box>
                <Box>
                    <Text>Anonymization: </Text>
                    <Text bold color={
                        complianceSettings.anonymizationLevel === 'STRICT' ? 'green' :
                        complianceSettings.anonymizationLevel === 'MODERATE' ? 'blue' :
                        complianceSettings.anonymizationLevel === 'BASIC' ? 'yellow' : 'red'
                    }>
                        {complianceSettings.anonymizationLevel}
                    </Text>
                </Box>
            </Box>
            
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
        </Box>
    );
    
    // Regions screen
    const renderRegionsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Region Selection</Text>
            </Box>
            
            {isLoading ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Verifying regional compliance requirements...
                    </Text>
                    <Text>Adjusting settings for local regulations</Text>
                </Box>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Text>Select your current region to update compliance settings</Text>
                    </Box>
                    
                    <Box flexDirection="column">
                        {regions.map(region => (
                            <Box 
                                key={region.id} 
                                flexDirection="column"
                                borderStyle={currentRegion.id === region.id ? "double" : "single"}
                                borderColor={getStatusColor(region.status)}
                                paddingX={2}
                                paddingY={1}
                                marginBottom={1}
                                onPress={() => setSelectedRegion(
                                    selectedRegion === region.id ? null : region.id
                                )}
                            >
                                <Box>
                                    <Text bold>{region.name}</Text>
                                    <Text> - </Text>
                                    <Text color={getStatusColor(region.status)}>
                                        {region.status.replace('_', ' ')}
                                    </Text>
                                </Box>
                                
                                <Box marginTop={1}>
                                    <Text>Restriction Level: </Text>
                                    <Text>{getRestrictionLevelBar(region.restrictionLevel)} {region.restrictionLevel}/10</Text>
                                </Box>
                                
                                {selectedRegion === region.id && (
                                    <>
                                        <Box marginTop={1} flexDirection="column">
                                            <Text bold>Required Documents:</Text>
                                            {region.requiredDocuments.map((doc, index) => (
                                                <Text key={index}>• {doc}</Text>
                                            ))}
                                        </Box>
                                        
                                        <Box marginTop={1} flexDirection="column">
                                            <Text bold>Compliance Tips:</Text>
                                            {region.complianceTips.map((tip, index) => (
                                                <Text key={index}>• {tip}</Text>
                                            ))}
                                        </Box>
                                        
                                        {currentRegion.id !== region.id && (
                                            <Box marginTop={1}>
                                                <Box 
                                                    backgroundColor="blue" 
                                                    paddingX={2} 
                                                    paddingY={1}
                                                    onPress={() => changeRegion(region.id)}
                                                >
                                                    <Text color="white">Select Region</Text>
                                                </Box>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        ))}
                    </Box>
                </>
            )}
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Settings screen
    const renderSettingsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Compliance Settings</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Configure how BROIP Protocol manages compliance</Text>
            </Box>
            
            <Box flexDirection="column">
                <Box 
                    flexDirection="column"
                    borderStyle="single"
                    paddingX={2}
                    paddingY={1}
                    marginBottom={1}
                >
                    <Box>
                        <Text bold>Legal Mode</Text>
                        <Text> - </Text>
                        <Text color={complianceSettings.enabled ? 'green' : 'red'}>
                            {complianceSettings.enabled ? 'ENABLED' : 'DISABLED'}
                        </Text>
                    </Box>
                    <Box marginY={1}>
                        <Text>Enables compliance with local regulations and applies appropriate restrictions</Text>
                    </Box>
                    <Box>
                        <Box 
                            backgroundColor={complianceSettings.enabled ? "red" : "green"} 
                            paddingX={2} 
                            paddingY={1}
                            onPress={() => toggleSetting('enabled')}
                        >
                            <Text color="white">
                                {complianceSettings.enabled ? 'Disable' : 'Enable'} Legal Mode
                            </Text>
                        </Box>
                    </Box>
                </Box>
                
                <Box 
                    flexDirection="column"
                    borderStyle="single"
                    paddingX={2}
                    paddingY={1}
                    marginBottom={1}
                >
                    <Box>
                        <Text bold>Anonymization Level</Text>
                        <Text> - </Text>
                        <Text color={
                            complianceSettings.anonymizationLevel === 'STRICT' ? 'green' :
                            complianceSettings.anonymizationLevel === 'MODERATE' ? 'blue' :
                            complianceSettings.anonymizationLevel === 'BASIC' ? 'yellow' : 'red'
                        }>
                            {complianceSettings.anonymizationLevel}
                        </Text>
                    </Box>
                    <Box marginY={1}>
                        <Text>{getAnonymizationDescription(complianceSettings.anonymizationLevel)}</Text>
                    </Box>
                    <Box>
                        <Box 
                            backgroundColor="blue" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={() => changeAnonymizationLevel('NONE')}
                        >
                            <Text color="white">None</Text>
                        </Box>
                        <Box 
                            backgroundColor="blue" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={() => changeAnonymizationLevel('BASIC')}
                        >
                            <Text color="white">Basic</Text>
                        </Box>
                        <Box 
                            backgroundColor="blue" 
                            paddingX={2} 
                            paddingY={1}
                            marginRight={1}
                            onPress={() => changeAnonymizationLevel('MODERATE')}
                        >
                            <Text color="white">Moderate</Text>
                        </Box>
                        <Box 
                            backgroundColor="blue" 
                            paddingX={2} 
                            paddingY={1}
                            onPress={() => changeAnonymizationLevel('STRICT')}
                        >
                            <Text color="white">Strict</Text>
                        </Box>
                    </Box>
                </Box>
                
                <Box 
                    flexDirection="column"
                    borderStyle="single"
                    paddingX={2}
                    paddingY={1}
                    marginBottom={1}
                >
                    <Box>
                        <Text bold>Geolocation Tracking</Text>
                        <Text> - </Text>
                        <Text color={complianceSettings.geolocationTracking ? 'green' : 'red'}>
                            {complianceSettings.geolocationTracking ? 'ENABLED' : 'DISABLED'}
                        </Text>
                    </Box>
                    <Box marginY={1}>
                        <Text>Enables automatic region detection to apply appropriate compliance rules</Text>
                    </Box>
                    <Box>
                        <Box 
                            backgroundColor={complianceSettings.geolocationTracking ? "red" : "green"} 
                            paddingX={2} 
                            paddingY={1}
                            onPress={() => toggleSetting('geolocationTracking')}
                        >
                            <Text color="white">
                                {complianceSettings.geolocationTracking ? 'Disable' : 'Enable'} Geolocation
                            </Text>
                        </Box>
                    </Box>
                </Box>
                
                <Box 
                    flexDirection="column"
                    borderStyle="single"
                    paddingX={2}
                    paddingY={1}
                    marginBottom={1}
                >
                    <Box>
                        <Text bold>Additional Settings</Text>
                    </Box>
                    <Box flexDirection="column" marginY={1}>
                        <Box marginY={1}>
                            <Text>Filtered Terminology: </Text>
                            <Text color={complianceSettings.filteredTerms ? 'green' : 'red'}>
                                {complianceSettings.filteredTerms ? 'ENABLED' : 'DISABLED'}
                            </Text>
                            <Box 
                                marginLeft={2}
                                backgroundColor={complianceSettings.filteredTerms ? "red" : "green"} 
                                paddingX={2} 
                                paddingY={1}
                                onPress={() => toggleSetting('filteredTerms')}
                            >
                                <Text color="white">Toggle</Text>
                            </Box>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Age Verification: </Text>
                            <Text color={complianceSettings.ageLock ? 'green' : 'red'}>
                                {complianceSettings.ageLock ? 'ENABLED' : 'DISABLED'}
                            </Text>
                            <Box 
                                marginLeft={2}
                                backgroundColor={complianceSettings.ageLock ? "red" : "green"} 
                                paddingX={2} 
                                paddingY={1}
                                onPress={() => toggleSetting('ageLock')}
                            >
                                <Text color="white">Toggle</Text>
                            </Box>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Document Verification: </Text>
                            <Text color={complianceSettings.documentVerification ? 'green' : 'red'}>
                                {complianceSettings.documentVerification ? 'ENABLED' : 'DISABLED'}
                            </Text>
                            <Box 
                                marginLeft={2}
                                backgroundColor={complianceSettings.documentVerification ? "red" : "green"} 
                                paddingX={2} 
                                paddingY={1}
                                onPress={() => toggleSetting('documentVerification')}
                            >
                                <Text color="white">Toggle</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Documents screen
    const renderDocumentsScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Document Verification</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Manage verification documents required in your region</Text>
            </Box>
            
            <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                <Box>
                    <Text bold>Required Documents for {currentRegion.name}</Text>
                </Box>
                
                <Box flexDirection="column" marginY={1}>
                    {currentRegion.requiredDocuments.map((doc, index) => (
                        <Box key={index} marginY={1}>
                            <Text>• {doc}: </Text>
                            <Text color="red">Not Verified</Text>
                            <Box 
                                marginLeft={2}
                                backgroundColor="green" 
                                paddingX={2} 
                                paddingY={1}
                            >
                                <Text color="white">Upload</Text>
                            </Box>
                        </Box>
                    ))}
                </Box>
                
                <Box marginY={1}>
                    <Text bold>Document Verification Process</Text>
                </Box>
                
                <Box marginY={1} flexDirection="column">
                    <Text>1. Upload required documents</Text>
                    <Text>2. Documents are encrypted and securely processed</Text>
                    <Text>3. Verification is complete within 24-48 hours</Text>
                    <Text>4. Verified status remains active for 1 year</Text>
                </Box>
                
                <Box marginY={1}>
                    <Text color="yellow">
                        Note: In simulation mode, document verification is skipped
                    </Text>
                </Box>
            </Box>
            
            <Box marginTop={2}>
                <Box backgroundColor="blue" paddingX={2} paddingY={1}>
                    <Text color="white" onPress={() => setActiveScreen('MENU')}>Back</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Compliance Report screen
    const renderReportScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Compliance Report</Text>
            </Box>
            
            {isLoading ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Generating compliance report...
                    </Text>
                </Box>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Text>Compliance status for <Text bold>{currentRegion.name}</Text></Text>
                    </Box>
                    
                    <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                        <Box>
                            <Text>Report Generated: </Text>
                            <Text>{new Date(complianceReport.timestamp).toLocaleString()}</Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>Overall Status: </Text>
                            <Text bold color={
                                complianceReport.overallStatus === 'COMPLIANT' ? 'green' :
                                complianceReport.overallStatus === 'PARTIAL' ? 'yellow' : 'red'
                            }>
                                {complianceReport.overallStatus}
                            </Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text>Risk Level: </Text>
                            <Text bold color={
                                complianceReport.riskLevel === 'LOW' ? 'green' :
                                complianceReport.riskLevel === 'MEDIUM' ? 'yellow' :
                                complianceReport.riskLevel === 'HIGH' ? 'red' : 'magenta'
                            }>
                                {complianceReport.riskLevel}
                            </Text>
                        </Box>
                        
                        {complianceReport.missingRequirements.length > 0 && (
                            <Box flexDirection="column" marginTop={1}>
                                <Text bold>Missing Requirements:</Text>
                                {complianceReport.missingRequirements.map((req, index) => (
                                    <Text key={index} color="red">• {req}</Text>
                                ))}
                            </Box>
                        )}
                        
                        <Box flexDirection="column" marginTop={1}>
                            <Text bold>Recommendations:</Text>
                            {complianceReport.recommendations.map((rec, index) => (
                                <Text key={index} color="blue">• {rec}</Text>
                            ))}
                        </Box>
                    </Box>
                    
                    <Box marginY={1}>
                        <Box 
                            borderStyle="single"
                            borderColor="cyan"
                            paddingX={2} 
                            paddingY={1}
                            onPress={generateComplianceReport}
                        >
                            <Text color="cyan">🔄 Refresh Report</Text>
                        </Box>
                    </Box>
                </>
            )}
            
            <Box marginTop={2}>
                <Box 
                    borderStyle="single"
                    borderColor="yellow"
                    paddingX={2} 
                    paddingY={1}
                    onPress={() => setActiveScreen('MENU')}
                >
                    <Text color="yellow">↩️ Back to Menu</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Risk Assessment screen
    const renderRiskAssessmentScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Risk Assessment</Text>
            </Box>
            
            <Box marginBottom={1}>
                <Text>Legal risk analysis for <Text bold>{currentRegion.name}</Text> ({currentRegion.status.replace('_', ' ')})</Text>
            </Box>
            
            <Box flexDirection="column">
                {riskAssessments.map((assessment, index) => (
                    <Box 
                        key={index} 
                        flexDirection="column"
                        borderStyle="single"
                        borderColor={
                            assessment.riskLevel === 'LOW' ? 'green' :
                            assessment.riskLevel === 'MEDIUM' ? 'yellow' :
                            assessment.riskLevel === 'HIGH' ? 'red' : 'magenta'
                        }
                        paddingX={2}
                        paddingY={1}
                        marginBottom={1}
                    >
                        <Box>
                            <Text bold>{assessment.activity}</Text>
                            <Text> - </Text>
                            <Text bold color={
                                assessment.riskLevel === 'LOW' ? 'green' :
                                assessment.riskLevel === 'MEDIUM' ? 'yellow' :
                                assessment.riskLevel === 'HIGH' ? 'red' : 'magenta'
                            }>
                                {assessment.riskLevel} RISK
                            </Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text bold>Legal Implications: </Text>
                            <Text>{assessment.legalImplications}</Text>
                        </Box>
                        
                        <Box marginTop={1}>
                            <Text bold>Recommendations: </Text>
                            <Text>{assessment.recommendations}</Text>
                        </Box>
                    </Box>
                ))}
            </Box>
            
            <Box marginTop={1}>
                <Box 
                    borderStyle="single"
                    borderColor="cyan"
                    paddingX={2} 
                    paddingY={1}
                    onPress={updateRiskAssessments}
                >
                    <Text color="cyan">🔄 Update Risk Assessment</Text>
                </Box>
            </Box>
            
            <Box marginTop={2}>
                <Box 
                    borderStyle="single"
                    borderColor="yellow"
                    paddingX={2} 
                    paddingY={1}
                    onPress={() => setActiveScreen('MENU')}
                >
                    <Text color="yellow">↩️ Back to Menu</Text>
                </Box>
            </Box>
        </Box>
    );
    
    // Export screen
    const renderExportScreen = () => (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="green">Export Compliance Data</Text>
            </Box>
            
            {isExporting ? (
                <Box flexDirection="column" marginY={2}>
                    <Text>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {' '}Preparing compliance data for export...
                    </Text>
                </Box>
            ) : (
                <>
                    <Box marginBottom={1}>
                        <Text>Export your compliance settings and reports for record-keeping</Text>
                    </Box>
                    
                    <Box flexDirection="column" borderStyle="single" paddingX={2} paddingY={1} marginBottom={1}>
                        <Box>
                            <Text bold>Export Information</Text>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Region: </Text>
                            <Text bold>{currentRegion.name}</Text>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Compliance Status: </Text>
                            <Text bold color={
                                complianceReport.overallStatus === 'COMPLIANT' ? 'green' :
                                complianceReport.overallStatus === 'PARTIAL' ? 'yellow' : 'red'
                            }>
                                {complianceReport.overallStatus}
                            </Text>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Export Format: </Text>
                            <Box 
                                borderStyle="single"
                                borderColor={exportFormat === 'JSON' ? 'cyan' : 'gray'}
                                paddingX={2} 
                                paddingY={1}
                                marginRight={1}
                                onPress={() => setExportFormat('JSON')}
                            >
                                <Text color={exportFormat === 'JSON' ? 'cyan' : 'gray'}>JSON</Text>
                            </Box>
                            <Box 
                                borderStyle="single"
                                borderColor={exportFormat === 'TEXT' ? 'cyan' : 'gray'}
                                paddingX={2} 
                                paddingY={1}
                                onPress={() => setExportFormat('TEXT')}
                            >
                                <Text color={exportFormat === 'TEXT' ? 'cyan' : 'gray'}>TEXT</Text>
                            </Box>
                        </Box>
                        
                        <Box marginY={1}>
                            <Text>Included Data:</Text>
                            <Box flexDirection="column" marginLeft={2} marginTop={1}>
                                <Text>✓ Region Information</Text>
                                <Text>✓ Compliance Settings</Text>
                                <Text>✓ Compliance Report</Text>
                                <Text>✓ Risk Assessment</Text>
                            </Box>
                        </Box>
                        
                        <Box marginY={1}>
                            <Box 
                                borderStyle="single"
                                borderColor="green"
                                paddingX={2} 
                                paddingY={1}
                                onPress={exportCompliance}
                            >
                                <Text color="green">💾 Export Data</Text>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box marginY={1} flexDirection="column">
                        <Text bold>Data Privacy Notice:</Text>
                        <Text>• Your compliance data is exported locally</Text>
                        <Text>• No data is shared with third parties</Text>
                        <Text>• Keep exported data secure as it may contain sensitive information</Text>
                    </Box>
                </>
            )}
            
            <Box marginTop={2}>
                <Box 
                    borderStyle="single"
                    borderColor="yellow"
                    paddingX={2} 
                    paddingY={1}
                    onPress={() => setActiveScreen('MENU')}
                >
                    <Text color="yellow">↩️ Back to Menu</Text>
                </Box>
            </Box>
        </Box>
    );
    
    if (activeScreen === 'REGIONS') {
        return renderRegionsScreen();
    }
    
    if (activeScreen === 'SETTINGS') {
        return renderSettingsScreen();
    }
    
    if (activeScreen === 'DOCUMENTS') {
        return renderDocumentsScreen();
    }
    
    if (activeScreen === 'REPORT') {
        return renderReportScreen();
    }
    
    if (activeScreen === 'RISK_ASSESSMENT') {
        return renderRiskAssessmentScreen();
    }
    
    if (activeScreen === 'EXPORT') {
        return renderExportScreen();
    }
    
    return renderMenuScreen();
};

export default LegalMode;

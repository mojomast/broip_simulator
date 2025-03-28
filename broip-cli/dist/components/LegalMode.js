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
const LegalMode = ({ onReturn }) => {
    const { preferences, updatePreferences } = (0, UserContext_1.useUser)();
    const [activeScreen, setActiveScreen] = (0, react_1.useState)('MENU');
    const [selectedRegion, setSelectedRegion] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [currentRegion, setCurrentRegion] = (0, react_1.useState)({
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
    const [complianceSettings, setComplianceSettings] = (0, react_1.useState)({
        enabled: true,
        geolocationTracking: true,
        anonymizationLevel: 'MODERATE',
        filteredTerms: true,
        ageLock: true,
        termsAccepted: true,
        documentVerification: false
    });
    const [complianceReport, setComplianceReport] = (0, react_1.useState)({
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
    const [riskAssessments, setRiskAssessments] = (0, react_1.useState)([
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
    const regions = [
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
    const [exportData, setExportData] = (0, react_1.useState)(null);
    const [exportFormat, setExportFormat] = (0, react_1.useState)('JSON');
    const [isExporting, setIsExporting] = (0, react_1.useState)(false);
    const handleMenuSelect = (item) => {
        if (item.value === 'return') {
            onReturn();
        }
        else if (item.value === 'risk') {
            setActiveScreen('RISK_ASSESSMENT');
        }
        else if (item.value === 'export') {
            setActiveScreen('EXPORT');
            prepareExportData();
        }
        else {
            setActiveScreen(item.value);
        }
    };
    const changeRegion = (regionId) => {
        setIsLoading(true);
        // Simulate location change and compliance check
        setTimeout(() => {
            const region = regions.find(r => r.id === regionId);
            if (region) {
                setCurrentRegion(region);
                // Auto-adjust compliance settings based on region
                setComplianceSettings(prev => ({
                    ...prev,
                    anonymizationLevel: region.restrictionLevel >= 8 ? 'STRICT' :
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
                        }
                        else if (region.status === 'MEDICAL_ONLY') {
                            assessment.riskLevel = 'HIGH';
                            assessment.legalImplications = 'Fines and potential criminal charges, medical card may not protect public use';
                        }
                        else if (region.status === 'LEGAL') {
                            assessment.riskLevel = 'MEDIUM';
                            assessment.legalImplications = 'Fines up to $500 in most legal regions, similar to public alcohol consumption';
                        }
                    }
                    // Possession Limits risk adjustment
                    if (assessment.activity === 'Possession Limits') {
                        if (region.status === 'PROHIBITED') {
                            assessment.riskLevel = 'CRITICAL';
                            assessment.legalImplications = 'Any possession is illegal, criminal charges likely';
                        }
                        else if (region.status === 'MEDICAL_ONLY') {
                            assessment.riskLevel = 'HIGH';
                            assessment.legalImplications = 'Exceeding medical limits can result in trafficking charges';
                        }
                    }
                    // Medical Documentation risk adjustment
                    if (assessment.activity === 'Medical Documentation') {
                        if (region.status === 'PROHIBITED') {
                            assessment.riskLevel = 'HIGH';
                            assessment.legalImplications = 'Medical documentation may not provide legal protection';
                        }
                        else if (region.status === 'LEGAL') {
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
    const toggleSetting = (setting) => {
        if (setting === 'enabled') {
            if (complianceSettings.enabled === false) {
                // Show warning when enabling legal mode
                if (confirm('Enabling Legal Mode will apply regional restrictions and compliance measures. Continue?')) {
                    setComplianceSettings(prev => ({
                        ...prev,
                        enabled: !prev.enabled
                    }));
                }
            }
            else {
                // Show stronger warning when disabling legal mode
                if (confirm('⚠️ WARNING: Disabling Legal Mode may violate local regulations in your region. You assume all legal responsibility for compliance. Continue?')) {
                    setComplianceSettings(prev => ({
                        ...prev,
                        enabled: !prev.enabled
                    }));
                }
            }
        }
        else {
            setComplianceSettings(prev => ({
                ...prev,
                [setting]: !prev[setting]
            }));
        }
    };
    const changeAnonymizationLevel = (level) => {
        setComplianceSettings(prev => ({
            ...prev,
            anonymizationLevel: level
        }));
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'LEGAL': return 'green';
            case 'MEDICAL_ONLY': return 'blue';
            case 'GRAY_AREA': return 'yellow';
            case 'PROHIBITED': return 'red';
        }
    };
    const getRestrictionLevelBar = (level) => {
        const full = '█';
        const empty = '░';
        return Array(10).fill(empty).map((char, i) => i < level ? full : char).join('');
    };
    const getAnonymizationDescription = (level) => {
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
            const missingRequirements = [];
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
            const recommendations = [];
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
            let overallStatus;
            let riskLevel;
            if (missingRequirements.length === 0) {
                overallStatus = 'COMPLIANT';
                riskLevel = 'LOW';
            }
            else if (missingRequirements.length <= 2) {
                overallStatus = 'PARTIAL';
                riskLevel = currentRegion.restrictionLevel >= 8 ? 'HIGH' : 'MEDIUM';
            }
            else {
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
                }
                else if (currentRegion.status === 'MEDICAL_ONLY') {
                    assessment.riskLevel = 'HIGH';
                    assessment.legalImplications = 'Fines and potential criminal charges, medical card may not protect public use';
                }
                else if (currentRegion.status === 'LEGAL') {
                    assessment.riskLevel = 'MEDIUM';
                    assessment.legalImplications = 'Fines up to $500 in most legal regions, similar to public alcohol consumption';
                }
            }
            // Possession Limits risk adjustment
            if (assessment.activity === 'Possession Limits') {
                if (currentRegion.status === 'PROHIBITED') {
                    assessment.riskLevel = 'CRITICAL';
                    assessment.legalImplications = 'Any possession is illegal, criminal charges likely';
                }
                else if (currentRegion.status === 'MEDICAL_ONLY') {
                    assessment.riskLevel = 'HIGH';
                    assessment.legalImplications = 'Exceeding medical limits can result in trafficking charges';
                }
            }
            // Medical Documentation risk adjustment
            if (assessment.activity === 'Medical Documentation') {
                if (currentRegion.status === 'PROHIBITED') {
                    assessment.riskLevel = 'HIGH';
                    assessment.legalImplications = 'Medical documentation may not provide legal protection';
                }
                else if (currentRegion.status === 'LEGAL') {
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
            const data = {
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
    const formatAsJSON = () => {
        if (!exportData)
            return '';
        return JSON.stringify(exportData, null, 2);
    };
    // Format export data as human-readable text
    const formatAsText = () => {
        if (!exportData)
            return '';
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
    const renderMenuScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Legal Mode: Compliance Settings")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Adjust settings to comply with local regulations")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, borderStyle: "single", paddingX: 2, paddingY: 1 },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, null, "Legal Mode: "),
                react_1.default.createElement(ink_1.Text, { bold: true, color: complianceSettings.enabled ? 'green' : 'red' }, complianceSettings.enabled ? 'ENABLED' : 'DISABLED')),
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, null, "Current Region: "),
                react_1.default.createElement(ink_1.Text, { bold: true }, currentRegion.name),
                react_1.default.createElement(ink_1.Text, null, " - "),
                react_1.default.createElement(ink_1.Text, { color: getStatusColor(currentRegion.status) }, currentRegion.status.replace('_', ' '))),
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, null, "Restriction Level: "),
                react_1.default.createElement(ink_1.Text, null,
                    getRestrictionLevelBar(currentRegion.restrictionLevel),
                    " ",
                    currentRegion.restrictionLevel,
                    "/10")),
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, null, "Anonymization: "),
                react_1.default.createElement(ink_1.Text, { bold: true, color: complianceSettings.anonymizationLevel === 'STRICT' ? 'green' :
                        complianceSettings.anonymizationLevel === 'MODERATE' ? 'blue' :
                            complianceSettings.anonymizationLevel === 'BASIC' ? 'yellow' : 'red' }, complianceSettings.anonymizationLevel))),
        react_1.default.createElement(ink_select_input_1.default, { items: menuItems, onSelect: handleMenuSelect })));
    // Regions screen
    const renderRegionsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Region Selection")),
        isLoading ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Verifying regional compliance requirements..."),
            react_1.default.createElement(ink_1.Text, null, "Adjusting settings for local regulations"))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Select your current region to update compliance settings")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, regions.map(region => (react_1.default.createElement(ink_1.Box, { key: region.id, flexDirection: "column", borderStyle: currentRegion.id === region.id ? "double" : "single", borderColor: getStatusColor(region.status), paddingX: 2, paddingY: 1, marginBottom: 1, onPress: () => setSelectedRegion(selectedRegion === region.id ? null : region.id) },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, region.name),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: getStatusColor(region.status) }, region.status.replace('_', ' '))),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Restriction Level: "),
                    react_1.default.createElement(ink_1.Text, null,
                        getRestrictionLevelBar(region.restrictionLevel),
                        " ",
                        region.restrictionLevel,
                        "/10")),
                selectedRegion === region.id && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, { bold: true }, "Required Documents:"),
                        region.requiredDocuments.map((doc, index) => (react_1.default.createElement(ink_1.Text, { key: index },
                            "\u2022 ",
                            doc)))),
                    react_1.default.createElement(ink_1.Box, { marginTop: 1, flexDirection: "column" },
                        react_1.default.createElement(ink_1.Text, { bold: true }, "Compliance Tips:"),
                        region.complianceTips.map((tip, index) => (react_1.default.createElement(ink_1.Text, { key: index },
                            "\u2022 ",
                            tip)))),
                    currentRegion.id !== region.id && (react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                        react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => changeRegion(region.id) },
                            react_1.default.createElement(ink_1.Text, { color: "white" }, "Select Region")))))))))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Settings screen
    const renderSettingsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Compliance Settings")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Configure how BROIP Protocol manages compliance")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Legal Mode"),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: complianceSettings.enabled ? 'green' : 'red' }, complianceSettings.enabled ? 'ENABLED' : 'DISABLED')),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Enables compliance with local regulations and applies appropriate restrictions")),
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Box, { backgroundColor: complianceSettings.enabled ? "red" : "green", paddingX: 2, paddingY: 1, onPress: () => toggleSetting('enabled') },
                        react_1.default.createElement(ink_1.Text, { color: "white" },
                            complianceSettings.enabled ? 'Disable' : 'Enable',
                            " Legal Mode")))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Anonymization Level"),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: complianceSettings.anonymizationLevel === 'STRICT' ? 'green' :
                            complianceSettings.anonymizationLevel === 'MODERATE' ? 'blue' :
                                complianceSettings.anonymizationLevel === 'BASIC' ? 'yellow' : 'red' }, complianceSettings.anonymizationLevel)),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, getAnonymizationDescription(complianceSettings.anonymizationLevel))),
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => changeAnonymizationLevel('NONE') },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "None")),
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => changeAnonymizationLevel('BASIC') },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Basic")),
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => changeAnonymizationLevel('MODERATE') },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Moderate")),
                    react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1, onPress: () => changeAnonymizationLevel('STRICT') },
                        react_1.default.createElement(ink_1.Text, { color: "white" }, "Strict")))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Geolocation Tracking"),
                    react_1.default.createElement(ink_1.Text, null, " - "),
                    react_1.default.createElement(ink_1.Text, { color: complianceSettings.geolocationTracking ? 'green' : 'red' }, complianceSettings.geolocationTracking ? 'ENABLED' : 'DISABLED')),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Enables automatic region detection to apply appropriate compliance rules")),
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Box, { backgroundColor: complianceSettings.geolocationTracking ? "red" : "green", paddingX: 2, paddingY: 1, onPress: () => toggleSetting('geolocationTracking') },
                        react_1.default.createElement(ink_1.Text, { color: "white" },
                            complianceSettings.geolocationTracking ? 'Disable' : 'Enable',
                            " Geolocation")))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Additional Settings")),
                react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
                    react_1.default.createElement(ink_1.Box, { marginY: 1 },
                        react_1.default.createElement(ink_1.Text, null, "Filtered Terminology: "),
                        react_1.default.createElement(ink_1.Text, { color: complianceSettings.filteredTerms ? 'green' : 'red' }, complianceSettings.filteredTerms ? 'ENABLED' : 'DISABLED'),
                        react_1.default.createElement(ink_1.Box, { marginLeft: 2, backgroundColor: complianceSettings.filteredTerms ? "red" : "green", paddingX: 2, paddingY: 1, onPress: () => toggleSetting('filteredTerms') },
                            react_1.default.createElement(ink_1.Text, { color: "white" }, "Toggle"))),
                    react_1.default.createElement(ink_1.Box, { marginY: 1 },
                        react_1.default.createElement(ink_1.Text, null, "Age Verification: "),
                        react_1.default.createElement(ink_1.Text, { color: complianceSettings.ageLock ? 'green' : 'red' }, complianceSettings.ageLock ? 'ENABLED' : 'DISABLED'),
                        react_1.default.createElement(ink_1.Box, { marginLeft: 2, backgroundColor: complianceSettings.ageLock ? "red" : "green", paddingX: 2, paddingY: 1, onPress: () => toggleSetting('ageLock') },
                            react_1.default.createElement(ink_1.Text, { color: "white" }, "Toggle"))),
                    react_1.default.createElement(ink_1.Box, { marginY: 1 },
                        react_1.default.createElement(ink_1.Text, null, "Document Verification: "),
                        react_1.default.createElement(ink_1.Text, { color: complianceSettings.documentVerification ? 'green' : 'red' }, complianceSettings.documentVerification ? 'ENABLED' : 'DISABLED'),
                        react_1.default.createElement(ink_1.Box, { marginLeft: 2, backgroundColor: complianceSettings.documentVerification ? "red" : "green", paddingX: 2, paddingY: 1, onPress: () => toggleSetting('documentVerification') },
                            react_1.default.createElement(ink_1.Text, { color: "white" }, "Toggle")))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Documents screen
    const renderDocumentsScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Document Verification")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null, "Manage verification documents required in your region")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true },
                    "Required Documents for ",
                    currentRegion.name)),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 }, currentRegion.requiredDocuments.map((doc, index) => (react_1.default.createElement(ink_1.Box, { key: index, marginY: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "\u2022 ",
                    doc,
                    ": "),
                react_1.default.createElement(ink_1.Text, { color: "red" }, "Not Verified"),
                react_1.default.createElement(ink_1.Box, { marginLeft: 2, backgroundColor: "green", paddingX: 2, paddingY: 1 },
                    react_1.default.createElement(ink_1.Text, { color: "white" }, "Upload")))))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Document Verification Process")),
            react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null, "1. Upload required documents"),
                react_1.default.createElement(ink_1.Text, null, "2. Documents are encrypted and securely processed"),
                react_1.default.createElement(ink_1.Text, null, "3. Verification is complete within 24-48 hours"),
                react_1.default.createElement(ink_1.Text, null, "4. Verified status remains active for 1 year")),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "Note: In simulation mode, document verification is skipped"))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { backgroundColor: "blue", paddingX: 2, paddingY: 1 },
                react_1.default.createElement(ink_1.Text, { color: "white", onPress: () => setActiveScreen('MENU') }, "Back")))));
    // Compliance Report screen
    const renderReportScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Compliance Report")),
        isLoading ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Generating compliance report..."))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null,
                    "Compliance status for ",
                    react_1.default.createElement(ink_1.Text, { bold: true }, currentRegion.name))),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, null, "Report Generated: "),
                    react_1.default.createElement(ink_1.Text, null, new Date(complianceReport.timestamp).toLocaleString())),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Overall Status: "),
                    react_1.default.createElement(ink_1.Text, { bold: true, color: complianceReport.overallStatus === 'COMPLIANT' ? 'green' :
                            complianceReport.overallStatus === 'PARTIAL' ? 'yellow' : 'red' }, complianceReport.overallStatus)),
                react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Risk Level: "),
                    react_1.default.createElement(ink_1.Text, { bold: true, color: complianceReport.riskLevel === 'LOW' ? 'green' :
                            complianceReport.riskLevel === 'MEDIUM' ? 'yellow' :
                                complianceReport.riskLevel === 'HIGH' ? 'red' : 'magenta' }, complianceReport.riskLevel)),
                complianceReport.missingRequirements.length > 0 && (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Missing Requirements:"),
                    complianceReport.missingRequirements.map((req, index) => (react_1.default.createElement(ink_1.Text, { key: index, color: "red" },
                        "\u2022 ",
                        req))))),
                react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginTop: 1 },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Recommendations:"),
                    complianceReport.recommendations.map((rec, index) => (react_1.default.createElement(ink_1.Text, { key: index, color: "blue" },
                        "\u2022 ",
                        rec))))),
            react_1.default.createElement(ink_1.Box, { marginY: 1 },
                react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "cyan", paddingX: 2, paddingY: 1, onPress: generateComplianceReport },
                    react_1.default.createElement(ink_1.Text, { color: "cyan" }, "\uD83D\uDD04 Refresh Report"))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "yellow", paddingX: 2, paddingY: 1, onPress: () => setActiveScreen('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u21A9\uFE0F Back to Menu")))));
    // Risk Assessment screen
    const renderRiskAssessmentScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Risk Assessment")),
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, null,
                "Legal risk analysis for ",
                react_1.default.createElement(ink_1.Text, { bold: true }, currentRegion.name),
                " (",
                currentRegion.status.replace('_', ' '),
                ")")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, riskAssessments.map((assessment, index) => (react_1.default.createElement(ink_1.Box, { key: index, flexDirection: "column", borderStyle: "single", borderColor: assessment.riskLevel === 'LOW' ? 'green' :
                assessment.riskLevel === 'MEDIUM' ? 'yellow' :
                    assessment.riskLevel === 'HIGH' ? 'red' : 'magenta', paddingX: 2, paddingY: 1, marginBottom: 1 },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Text, { bold: true }, assessment.activity),
                react_1.default.createElement(ink_1.Text, null, " - "),
                react_1.default.createElement(ink_1.Text, { bold: true, color: assessment.riskLevel === 'LOW' ? 'green' :
                        assessment.riskLevel === 'MEDIUM' ? 'yellow' :
                            assessment.riskLevel === 'HIGH' ? 'red' : 'magenta' },
                    assessment.riskLevel,
                    " RISK")),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Legal Implications: "),
                react_1.default.createElement(ink_1.Text, null, assessment.legalImplications)),
            react_1.default.createElement(ink_1.Box, { marginTop: 1 },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Recommendations: "),
                react_1.default.createElement(ink_1.Text, null, assessment.recommendations)))))),
        react_1.default.createElement(ink_1.Box, { marginTop: 1 },
            react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "cyan", paddingX: 2, paddingY: 1, onPress: updateRiskAssessments },
                react_1.default.createElement(ink_1.Text, { color: "cyan" }, "\uD83D\uDD04 Update Risk Assessment"))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "yellow", paddingX: 2, paddingY: 1, onPress: () => setActiveScreen('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u21A9\uFE0F Back to Menu")))));
    // Export screen
    const renderExportScreen = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, "Export Compliance Data")),
        isExporting ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 2 },
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    react_1.default.createElement(ink_spinner_1.default, { type: "dots" })),
                ' ',
                "Preparing compliance data for export..."))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, { marginBottom: 1 },
                react_1.default.createElement(ink_1.Text, null, "Export your compliance settings and reports for record-keeping")),
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", borderStyle: "single", paddingX: 2, paddingY: 1, marginBottom: 1 },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Export Information")),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Region: "),
                    react_1.default.createElement(ink_1.Text, { bold: true }, currentRegion.name)),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Compliance Status: "),
                    react_1.default.createElement(ink_1.Text, { bold: true, color: complianceReport.overallStatus === 'COMPLIANT' ? 'green' :
                            complianceReport.overallStatus === 'PARTIAL' ? 'yellow' : 'red' }, complianceReport.overallStatus)),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Export Format: "),
                    react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: exportFormat === 'JSON' ? 'cyan' : 'gray', paddingX: 2, paddingY: 1, marginRight: 1, onPress: () => setExportFormat('JSON') },
                        react_1.default.createElement(ink_1.Text, { color: exportFormat === 'JSON' ? 'cyan' : 'gray' }, "JSON")),
                    react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: exportFormat === 'TEXT' ? 'cyan' : 'gray', paddingX: 2, paddingY: 1, onPress: () => setExportFormat('TEXT') },
                        react_1.default.createElement(ink_1.Text, { color: exportFormat === 'TEXT' ? 'cyan' : 'gray' }, "TEXT"))),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Text, null, "Included Data:"),
                    react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginLeft: 2, marginTop: 1 },
                        react_1.default.createElement(ink_1.Text, null, "\u2713 Region Information"),
                        react_1.default.createElement(ink_1.Text, null, "\u2713 Compliance Settings"),
                        react_1.default.createElement(ink_1.Text, null, "\u2713 Compliance Report"),
                        react_1.default.createElement(ink_1.Text, null, "\u2713 Risk Assessment"))),
                react_1.default.createElement(ink_1.Box, { marginY: 1 },
                    react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "green", paddingX: 2, paddingY: 1, onPress: exportCompliance },
                        react_1.default.createElement(ink_1.Text, { color: "green" }, "\uD83D\uDCBE Export Data")))),
            react_1.default.createElement(ink_1.Box, { marginY: 1, flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, { bold: true }, "Data Privacy Notice:"),
                react_1.default.createElement(ink_1.Text, null, "\u2022 Your compliance data is exported locally"),
                react_1.default.createElement(ink_1.Text, null, "\u2022 No data is shared with third parties"),
                react_1.default.createElement(ink_1.Text, null, "\u2022 Keep exported data secure as it may contain sensitive information")))),
        react_1.default.createElement(ink_1.Box, { marginTop: 2 },
            react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "yellow", paddingX: 2, paddingY: 1, onPress: () => setActiveScreen('MENU') },
                react_1.default.createElement(ink_1.Text, { color: "yellow" }, "\u21A9\uFE0F Back to Menu")))));
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
exports.default = LegalMode;

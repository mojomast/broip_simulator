"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldErrorResolve = exports.getRandomLoadingPhrase = exports.generateErrorMessage = exports.generateErrorCode = exports.generateTechnicalPhrase = exports.errorTypes = exports.technicalStates = exports.technicalNouns = exports.technicalPrefixes = void 0;
exports.technicalPrefixes = [
    'CHRONIC', 'CRYSTAL', 'HYDROPONIC', 'PURPLE', 'DANK',
    'STICKY', 'PREMIUM', 'COSMIC', 'BLAZING', 'HERBAL'
];
exports.technicalNouns = [
    'KUSH', 'HERB', 'CLOUDS', 'CHAMBER', 'BOWL',
    'PIECE', 'PERCOLATOR', 'DIFFUSER', 'CHAMBER', 'BUBBLER'
];
exports.technicalStates = [
    'PACKING', 'GRINDING', 'LOADING', 'LIGHTING', 'INHALING',
    'MILKING', 'CLEARING', 'FILTERING', 'COOLING', 'DIFFUSING'
];
exports.errorTypes = [
    'BOWL_CASHED', 'WATER_OVERFLOW', 'AIRFLOW_BLOCKED', 'LIGHTER_MISSING',
    'CHAMBER_OVERFLOW', 'SMOKE_LOCKOUT', 'FILTER_CLOGGED',
    'BOWL_SCORCHED', 'PERCOLATOR_FLOOD', 'DOWNSTEM_BLOCKED'
];
const generateTechnicalPhrase = () => {
    const prefix = exports.technicalPrefixes[Math.floor(Math.random() * exports.technicalPrefixes.length)];
    const noun = exports.technicalNouns[Math.floor(Math.random() * exports.technicalNouns.length)];
    const state = exports.technicalStates[Math.floor(Math.random() * exports.technicalStates.length)];
    return `${state} ${prefix} ${noun}`;
};
exports.generateTechnicalPhrase = generateTechnicalPhrase;
const generateErrorCode = () => {
    return `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}`;
};
exports.generateErrorCode = generateErrorCode;
const generateErrorMessage = () => {
    const errorType = exports.errorTypes[Math.floor(Math.random() * exports.errorTypes.length)];
    return `${errorType}_ERROR_${(0, exports.generateErrorCode)()}`;
};
exports.generateErrorMessage = generateErrorMessage;
const getRandomLoadingPhrase = () => {
    const phrases = [
        'Initializing glass cooling matrix...',
        'Recalibrating percolator pathways...',
        'Synchronizing smoke chambers...',
        'Optimizing airflow dynamics...',
        'Defragmenting bubble stacks...',
        'Calculating herb coefficients...',
        'Validating filter integrity...',
        'Processing vapor variables...',
        'Analyzing crystal formation...',
        'Reticulating smoke patterns...'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
};
exports.getRandomLoadingPhrase = getRandomLoadingPhrase;
const shouldErrorResolve = () => Math.random() < 0.5;
exports.shouldErrorResolve = shouldErrorResolve;

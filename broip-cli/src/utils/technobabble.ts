export const technicalPrefixes = [
    'CHRONIC', 'CRYSTAL', 'HYDROPONIC', 'PURPLE', 'DANK',
    'STICKY', 'PREMIUM', 'COSMIC', 'BLAZING', 'HERBAL'
];

export const technicalNouns = [
    'KUSH', 'HERB', 'CLOUDS', 'CHAMBER', 'BOWL',
    'PIECE', 'PERCOLATOR', 'DIFFUSER', 'CHAMBER', 'BUBBLER'
];

export const technicalStates = [
    'PACKING', 'GRINDING', 'LOADING', 'LIGHTING', 'INHALING',
    'MILKING', 'CLEARING', 'FILTERING', 'COOLING', 'DIFFUSING'
];

export const errorTypes = [
    'BOWL_CASHED', 'WATER_OVERFLOW', 'AIRFLOW_BLOCKED', 'LIGHTER_MISSING',
    'CHAMBER_OVERFLOW', 'SMOKE_LOCKOUT', 'FILTER_CLOGGED',
    'BOWL_SCORCHED', 'PERCOLATOR_FLOOD', 'DOWNSTEM_BLOCKED'
];

export const generateTechnicalPhrase = () => {
    const prefix = technicalPrefixes[Math.floor(Math.random() * technicalPrefixes.length)];
    const noun = technicalNouns[Math.floor(Math.random() * technicalNouns.length)];
    const state = technicalStates[Math.floor(Math.random() * technicalStates.length)];
    return `${state} ${prefix} ${noun}`;
};

export const generateErrorCode = () => {
    return `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}`;
};

export const generateErrorMessage = () => {
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    return `${errorType}_ERROR_${generateErrorCode()}`;
};

export const getRandomLoadingPhrase = () => {
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

export const shouldErrorResolve = () => Math.random() < 0.5;

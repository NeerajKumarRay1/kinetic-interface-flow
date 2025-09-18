// Ethical AI Configuration
// This file contains configurable settings for the ethical AI system

const ETHICAL_CONFIG = {
    // System behavior settings
    behavior: {
        strictMode: true,              // Enable strict ethical enforcement
        transparencyLevel: 'high',     // 'low', 'medium', 'high'
        appealEnabled: true,           // Enable user appeal system
        confidenceThreshold: 0.7,      // Minimum confidence for responses
        biasDetectionSensitivity: 'medium' // 'low', 'medium', 'high'
    },

    // UI settings
    ui: {
        showConfidenceIndicators: true,
        showTransparencyDetails: true,
        showAppealButtons: true,
        colorCodeConfidence: true,
        expandableDetails: true
    },

    // Logging and monitoring
    monitoring: {
        logEthicalDecisions: true,
        logAppeals: true,
        logBiasDetection: true,
        retainLogsFor: 30 // days
    },

    // Response processing settings
    processing: {
        validateAllResponses: true,
        addTransparencyInfo: true,
        flagPotentialBias: true,
        requireSourceCitation: false,
        maxResponseLength: 2000
    },

    // Appeal system settings
    appeals: {
        categorizeAppeals: true,
        provideImmediateFeedback: true,
        suggestAlternatives: true,
        trackAppealStats: true,
        maxAppealsPerSession: 10
    },

    // Ethical pattern sensitivity levels
    patternSensitivity: {
        misinformation: 'high',
        scams: 'high',
        sensitiveInfo: 'high',
        professionalAdvice: 'medium',
        harmfulContent: 'critical',
        bias: 'medium'
    },

    // Custom ethical rules (can be extended)
    customRules: {
        // Add custom patterns or rules here
        // Example:
        // customPattern: {
        //     patterns: [/custom pattern/i],
        //     severity: 'medium',
        //     message: 'Custom ethical concern detected'
        // }
    }
};

// Validation functions for configuration
const CONFIG_VALIDATORS = {
    validateSensitivity: (level) => {
        return ['low', 'medium', 'high', 'critical'].includes(level);
    },
    
    validateTransparencyLevel: (level) => {
        return ['low', 'medium', 'high'].includes(level);
    },
    
    validateThreshold: (threshold) => {
        return typeof threshold === 'number' && threshold >= 0 && threshold <= 1;
    }
};

// Configuration update functions
const CONFIG_MANAGER = {
    updateConfig: (path, value) => {
        const keys = path.split('.');
        let current = ETHICAL_CONFIG;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        console.log(`Configuration updated: ${path} = ${value}`);
    },
    
    getConfig: (path) => {
        const keys = path.split('.');
        let current = ETHICAL_CONFIG;
        
        for (const key of keys) {
            if (current[key] === undefined) return null;
            current = current[key];
        }
        
        return current;
    },
    
    resetToDefaults: () => {
        // Reset configuration to default values
        console.log('Configuration reset to defaults');
        // Implementation would restore original values
    },
    
    validateConfiguration: () => {
        const issues = [];
        
        // Validate sensitivity levels
        Object.entries(ETHICAL_CONFIG.patternSensitivity).forEach(([key, value]) => {
            if (!CONFIG_VALIDATORS.validateSensitivity(value)) {
                issues.push(`Invalid sensitivity level for ${key}: ${value}`);
            }
        });
        
        // Validate transparency level
        if (!CONFIG_VALIDATORS.validateTransparencyLevel(ETHICAL_CONFIG.behavior.transparencyLevel)) {
            issues.push(`Invalid transparency level: ${ETHICAL_CONFIG.behavior.transparencyLevel}`);
        }
        
        // Validate confidence threshold
        if (!CONFIG_VALIDATORS.validateThreshold(ETHICAL_CONFIG.behavior.confidenceThreshold)) {
            issues.push(`Invalid confidence threshold: ${ETHICAL_CONFIG.behavior.confidenceThreshold}`);
        }
        
        return {
            valid: issues.length === 0,
            issues: issues
        };
    }
};

// Export for use in applications
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        ETHICAL_CONFIG,
        CONFIG_VALIDATORS,
        CONFIG_MANAGER
    };
} else {
    // Browser environment
    window.ETHICAL_CONFIG = ETHICAL_CONFIG;
    window.CONFIG_VALIDATORS = CONFIG_VALIDATORS;
    window.CONFIG_MANAGER = CONFIG_MANAGER;
}
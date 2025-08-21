
/**
 * Privacy and Compliance Configuration
 * Required for mobile app store approval
 */

export const PRIVACY_CONFIG = {
  // Privacy Policy URL (required for app stores)
  privacyPolicyUrl: 'https://agritender.co.ke/privacy',
  
  // Terms of Service URL (required for app stores)
  termsOfServiceUrl: 'https://agritender.co.ke/terms',
  
  // Data Collection Disclosure
  dataCollection: {
    personalInfo: {
      collected: true,
      purpose: 'User authentication and profile management',
      types: ['email', 'phone', 'name', 'location']
    },
    usage: {
      collected: true,
      purpose: 'App performance and user experience improvement',
      types: ['app_interactions', 'crash_logs', 'performance_metrics']
    },
    location: {
      collected: true,
      purpose: 'Market location services and logistics',
      types: ['precise_location', 'approximate_location']
    },
    audio: {
      collected: true,
      purpose: 'Voice commands and transcription',
      types: ['voice_recordings', 'audio_files']
    }
  },
  
  // Security Measures
  security: {
    encryption: 'AES-256',
    transmission: 'TLS 1.3',
    storage: 'Encrypted local storage',
    authentication: 'Multi-factor (SMS/Email)'
  },
  
  // Age Rating
  ageRating: {
    minimum: 4, // Years
    category: 'Educational/Business',
    contentRating: 'Everyone'
  },
  
  // Accessibility Features
  accessibility: {
    screenReader: true,
    voiceCommands: true,
    highContrast: true,
    fontSize: 'Adjustable',
    keyboardNavigation: true
  }
};

// Content Rating Justification
export const CONTENT_RATING = {
  violence: 'None',
  nudity: 'None',
  language: 'Mild (Agricultural terminology)',
  gambling: 'None',
  alcohol: 'None',
  drugs: 'None (Agricultural pesticides mentioned educationally)',
  category: 'Business/Educational'
};

// App Store Optimization
export const ASO_CONFIG = {
  keywords: [
    'agriculture', 'farming', 'market prices', 'kenya agriculture',
    'crop trading', 'farmer market', 'agricultural data', 'supply chain',
    'kilimo', 'mazao', 'soko', 'bei za mazao'
  ],
  description: {
    short: 'Agricultural market platform connecting Kenyan farmers with buyers, real-time prices, and trading opportunities.',
    long: `AgriTender Connect is Kenya's comprehensive agricultural platform providing:
    
• Real-time market prices and forecasts
• Direct farmer-to-buyer connections
• Multi-language support (English, Swahili, Kikuyu, Luo)
• Voice-enabled AI assistant for market insights
• Supply chain optimization and logistics
• Quality control and certification tracking
• Training and educational resources

Empowering smallholder farmers with technology to increase income, reduce post-harvest losses, and access better markets across Kenya.`
  }
};

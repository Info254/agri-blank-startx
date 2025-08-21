/**
 * Security Configuration
 * 
 * This file contains security-related configurations and constants used throughout the application.
 */

export const SecurityConfig = {
  // Session timeout in milliseconds (30 minutes)
  SESSION_TIMEOUT: 30 * 60 * 1000,
  
  // Token refresh margin (5 minutes before expiry)
  TOKEN_REFRESH_MARGIN: 5 * 60 * 1000,
  
  // Maximum number of failed login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration in minutes after maximum failed attempts
  LOCKOUT_DURATION: 15,
  
  // Password requirements
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+{}|:<>?~`-=[]\\;\',./',
  },
  
  // API security headers
  API_HEADERS: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
  
  // CORS configuration
  CORS_OPTIONS: {
    origin: [
      'https://your-production-domain.com',
      'https://staging.your-domain.com',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
  
  // Rate limiting configuration
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  
  // Security headers for production
  getSecurityHeaders: (isProduction: boolean = process.env.NODE_ENV === 'production') => {
    const headers = { ...this.API_HEADERS };
    
    if (isProduction) {
      // Add additional production-only headers
      return {
        ...headers,
        'Content-Security-Policy': `${headers['Content-Security-Policy']} upgrade-insecure-requests;`,
        'Expect-CT': 'max-age=86400, enforce',
      };
    }
    
    return headers;
  },
  
  // Validate password against requirements
  validatePassword: (password: string): { valid: boolean; message?: string } => {
    const { 
      minLength, 
      requireUppercase, 
      requireLowercase, 
      requireNumbers, 
      requireSpecialChars, 
      specialChars 
    } = this.PASSWORD_REQUIREMENTS;
    
    if (password.length < minLength) {
      return { 
        valid: false, 
        message: `Password must be at least ${minLength} characters long` 
      };
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one uppercase letter' 
      };
    }
    
    if (requireLowercase && !/[a-z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one lowercase letter' 
      };
    }
    
    if (requireNumbers && !/\d/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one number' 
      };
    }
    
    if (requireSpecialChars && !new RegExp(`[${specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
      return { 
        valid: false, 
        message: `Password must contain at least one special character (${specialChars})` 
      };
    }
    
    return { valid: true };
  },
  
  // Generate a secure random string
  generateSecureRandom: (length: number = 32): string => {
    const array = new Uint8Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto API
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  // Sanitize user input to prevent XSS
  sanitizeInput: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
};

export default SecurityConfig;

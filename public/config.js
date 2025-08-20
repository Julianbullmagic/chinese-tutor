// Frontend Configuration
// This file contains configuration that can be safely exposed to the browser

// Backend API URL - will be set by environment variable on Render
// For static sites, we need to handle this differently since process.env isn't available
let BACKEND_URL = 'http://localhost:3001'; // Default for local development

// Try to get backend URL from environment variable or use default
if (typeof process !== 'undefined' && process.env && process.env.BACKEND_URL) {
  BACKEND_URL = process.env.BACKEND_URL;
} else {
  // For production, this will be set by Render environment variable
  // We'll use a placeholder that gets replaced during build
  BACKEND_URL = 'https://chinese-tutor-backend.onrender.com';
}

// API endpoints
const API_ENDPOINTS = {
  HEALTH: `${BACKEND_URL}/api/health`,
  CHARACTERS: `${BACKEND_URL}/api/characters`,
  EVALUATE_PRONUNCIATION: `${BACKEND_URL}/api/evaluate-pronunciation`,
  GENERATE_SENTENCES: `${BACKEND_URL}/api/generate-sentences`,
  SPEAK: `${BACKEND_URL}/api/speak`
};

// Export for use in other scripts
window.APP_CONFIG = {
  BACKEND_URL,
  API_ENDPOINTS
};

console.log('🔧 App configuration loaded:', window.APP_CONFIG);

#!/usr/bin/env node

/**
 * Build-time script to inject environment variables into a runtime config
 * This runs during Netlify build to create a runtime configuration file
 */

const fs = require('fs');
const path = require('path');

const envVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_OPENROUTER_API_KEY',
  'VITE_OPENROUTER_MODEL'
];

const config = {};

// Collect environment variables
envVars.forEach(key => {
  const value = process.env[key];
  if (value) {
    config[key] = value;
  } else {
    console.warn(`Warning: Environment variable ${key} is not set`);
  }
});

// Create runtime config file
const configContent = `// Runtime configuration generated at build time
window.RUNTIME_CONFIG = ${JSON.stringify(config, null, 2)};`;

const outputPath = path.join(__dirname, '..', 'public', 'runtime-config.js');
fs.writeFileSync(outputPath, configContent);

console.log('Runtime configuration created:', outputPath);
console.log('Environment variables injected:', Object.keys(config));
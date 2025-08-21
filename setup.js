#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

console.log(
  `${colors.bright}${colors.blue}Setting up AI Therapist...${colors.reset}\n`
);

// Install root dependencies
console.log(`${colors.yellow}Installing root dependencies...${colors.reset}`);
execSync('npm install', { stdio: 'inherit' });

// Backend removed - using OpenRouter directly from frontend

// Install frontend-vite dependencies
console.log(`\n${colors.yellow}Setting up frontend...${colors.reset}`);
const frontendPath = path.join(__dirname, 'frontend-vite');
if (fs.existsSync(frontendPath)) {
  execSync('npm run install:frontend', { stdio: 'inherit' });
} else {
  console.error(`${colors.bright}Frontend directory not found!${colors.reset}`);
  process.exit(1);
}

console.log(`\n${colors.bright}${colors.green}Setup complete!${colors.reset}`);
console.log(`\nTo start the application, run:`);
console.log(`${colors.magenta}npm run dev${colors.reset}`);
console.log(`\nThis will start the frontend application.`);
console.log(`\nMake sure to set your OpenRouter API key in the .env file!`);

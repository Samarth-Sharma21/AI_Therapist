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

// Install backend dependencies
console.log(`\n${colors.yellow}Setting up backend...${colors.reset}`);
const backendPath = path.join(__dirname, 'backend');
if (fs.existsSync(backendPath)) {
  execSync('npm run install:backend', { stdio: 'inherit' });
} else {
  console.error(`${colors.bright}Backend directory not found!${colors.reset}`);
  process.exit(1);
}

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
console.log(`\nTo start the application in development mode, run:`);
console.log(`${colors.magenta}npm run dev${colors.reset}`);
console.log(`\nThis will start both the frontend and backend servers.`);
console.log(`\nTo start only the frontend, run:`);
console.log(`${colors.magenta}npm run frontend${colors.reset}`);
console.log(`\nTo start only the backend, run:`);
console.log(`${colors.magenta}npm run backend${colors.reset}`);

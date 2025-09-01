/**
 * Environment Variable Injector
 * 
 * This script injects environment variables into the global scope at runtime
 * to prevent them from being bundled into the build output.
 */

export const injectEnvironmentVariables = () => {
  // Create ENV object on window if it doesn't exist
  if (typeof window !== 'undefined') {
    (window as any).ENV = (window as any).ENV || {};
    
    // Map VITE_ prefixed environment variables
    const envVars = [
      'VITE_OPENROUTER_API_KEY',
      'VITE_OPENROUTER_MODEL',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    envVars.forEach(key => {
      // Check if the variable exists in the environment
      if (typeof process !== 'undefined' && process.env && process.env[key]) {
        (window as any).ENV[key] = process.env[key];
      } else if (typeof window !== 'undefined' && (window as any)[key]) {
        (window as any).ENV[key] = (window as any)[key];
      }
    });
  }
};
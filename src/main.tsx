import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { injectEnvironmentVariables } from './utils/env-injector.ts';

// Inject environment variables at runtime
injectEnvironmentVariables();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

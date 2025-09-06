import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Removed .tsx extension for better module resolution by bundlers.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
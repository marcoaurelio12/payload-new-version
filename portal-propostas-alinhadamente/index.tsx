import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Tailwind CSS v4 - processed by @tailwindcss/vite plugin
import './styles/tailwind.css';

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

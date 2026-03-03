import React from 'react';
import { createRoot } from 'react-dom/client';
import AppTailwind from './AppTailwind';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/tailwind.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppTailwind />
    </ErrorBoundary>
  </React.StrictMode>
);

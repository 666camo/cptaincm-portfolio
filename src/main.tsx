import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import ThemeProvider from './app/ThemeProvider';
import './styles/tokens.css';
import './styles/global.css';
import './styles/comic.css';
import './styles/dock.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider><App /></ThemeProvider>
  </React.StrictMode>,
);

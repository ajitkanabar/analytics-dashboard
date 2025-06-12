import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // ← make sure styles are loaded

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{
      colorScheme: 'light', // Force Light mode
    }}
  >
    <App />
  </MantineProvider>
);

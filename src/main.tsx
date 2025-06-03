
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import { FirestoreProvider } from './context/FirestoreContext';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppProvider>
      <FirestoreProvider>
        <App />
      </FirestoreProvider>
    </AppProvider>
  </React.StrictMode>
);

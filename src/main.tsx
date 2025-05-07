
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import { FirestoreProvider } from './context/FirestoreContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <FirestoreProvider>
        <Router>
          <App />
        </Router>
      </FirestoreProvider>
    </AppProvider>
  </React.StrictMode>
);

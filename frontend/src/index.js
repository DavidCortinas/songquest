import React from 'react';
import ReactDOM from 'react-dom/client';
// import "dotenv/config";
import { BrowserRouter as Router } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { configuredStore } from './store';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = configuredStore();
const persistor = persistStore(store);
window.React = React

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Router>
    </PersistGate>
  </Provider>
);
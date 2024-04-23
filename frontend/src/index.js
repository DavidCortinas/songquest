import React from 'react';
import ReactDOM from 'react-dom/client';
// import "dotenv/config";
import { BrowserRouter as Router } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import App from './App';
import { SnackbarProvider } from './contexts/snackbar/SnackbarContext';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const persistor = persistStore(store);
window.React = React;
console.log('Running in environment:', process.env.NODE_ENV);

root.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<SnackbarProvider>
				<Router>
					<React.StrictMode>
						<App />
					</React.StrictMode>
				</Router>
			</SnackbarProvider>
		</PersistGate>
	</Provider>
);

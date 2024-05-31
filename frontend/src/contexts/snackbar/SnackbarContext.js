import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import { AppSnack } from './AppSnack';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');
	const [timeoutId, setTimeoutId] = useState(null);

	const handleSnackbarClose = () => {
		setOpenSnackbar(false);
	};

	const showSnackbar = (message, severity = 'info', duration = 3000) => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
		setOpenSnackbar(true);
		clearTimeout(timeoutId); // Clear any existing timeout
		const id = setTimeout(handleSnackbarClose, duration); // Set new timeout
		setTimeoutId(id);
	};

	useEffect(() => {
		return () => {
			clearTimeout(timeoutId); // Clear timeout on component unmount
		};
	}, []);

	return (
		<SnackbarContext.Provider value={showSnackbar}>
			{children}
			<AppSnack
				open={openSnackbar}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={handleSnackbarClose}
			/>
		</SnackbarContext.Provider>
	);
};

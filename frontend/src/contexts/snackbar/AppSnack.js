import React from 'react';
import { Alert, Snackbar } from '@mui/material';

export const AppSnack = ({ open, message, severity, onClose }) => (
	<Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
		<Alert variant='filled' onClose={onClose} severity={severity} sx={{ width: '100%' }}>
			{message}
		</Alert>
	</Snackbar>
);

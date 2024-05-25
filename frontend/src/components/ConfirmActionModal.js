import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmActionModal = ({ open, onClose, onConfirm, item, actionType, tokens }) => {
	const handleConfirm = () => {
		onConfirm(item);
		onClose();
	};

	const isDeleteAction = actionType === 'delete';
	const headerText = isDeleteAction ? 'Delete Confirmation' : 'Use Tokens Confirmation';
	const paragraphText = isDeleteAction
		? `Are you sure you want to permanently delete ${item.name}? This action cannot be undone.`
		: `Do you want to use ${tokens} tokens to complete this transaction?`;
	const cancelButtonText = 'Cancel';
	const confirmButtonText = isDeleteAction ? 'Delete' : 'Use Tokens';
	const confirmButtonColor = isDeleteAction ? 'error' : 'success';

	return (
		<Modal
			open={open}
			aria-labelledby='confirmation-modal'
			aria-describedby='confirmation-modal-description'
			slotProps={{
				backdrop: { onClick: event => event.stopPropagation() }
			}}
		>
			<Box
				onClick={event => event.stopPropagation()}
				display='flex'
				flexDirection='column'
				alignItems='center'
				sx={{
					backgroundColor: 'rgba(13,27,38,0.9)',
					color: 'white',
					border: '2px solid rgba(89, 149, 192, 0.5)',
					borderRadius: '18px',
					overflowY: 'auto',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					boxShadow: 24,
					p: 4
				}}
			>
				<Typography id='confirmation-modal' variant='h6' component='h2' align='center'>
					{headerText}
				</Typography>
				<Typography id='confirmation-modal-description' sx={{ mt: 2 }} align='center'>
					{paragraphText}
				</Typography>
				<Box
					sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', width: '100%' }}
				>
					<Button onClick={onClose} variant='outlined' color='secondary'>
						{cancelButtonText}
					</Button>
					<Button onClick={handleConfirm} variant='contained' color={confirmButtonColor}>
						{confirmButtonText}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default ConfirmActionModal;

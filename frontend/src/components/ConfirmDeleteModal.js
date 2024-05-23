import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, onDelete, item }) => {
	const handleDelete = () => {
		onDelete(item);
		onClose();
	};

	return (
		<Modal
			open={open}
			// onClose={onClose}
			aria-labelledby='delete-confirmation-modal'
			aria-describedby='delete-confirmation-modal-description'
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
				<Typography
					id='delete-confirmation-modal'
					variant='h6'
					component='h2'
					align='center'
				>
					{'Delete Confirmation'}
				</Typography>
				<Typography
					id='delete-confirmation-modal-description'
					sx={{ mt: 2 }}
					align='center'
				>
					{`Are you sure you want to permanently delete ${item.name}? This action cannot be
					undone.`}
				</Typography>
				<Box
					sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', width: '100%' }}
				>
					<Button onClick={onClose} variant='outlined'>
						{'Cancel'}
					</Button>
					<Button onClick={handleDelete} variant='contained' color='error'>
						{'Delete'}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default ConfirmDeleteModal;

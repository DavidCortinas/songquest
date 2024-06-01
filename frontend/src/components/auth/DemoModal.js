import React from 'react';
import { Box, Modal } from '@mui/material';
import video from '../../../public/images/sq-demo.mp4';

export const DemoModal = ({ openDemoVideo, handleCloseDemoVideo }) => (
	<Modal open={openDemoVideo} onClose={handleCloseDemoVideo}>
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: 'rgba(13,27,38,0.9)',
				color: 'white',
				border: '2px solid rgba(89, 149, 192, 0.5)',
				overflowY: 'auto',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '80%',
				minHeight: '80%',
				boxShadow: 24
			}}
		>
			<video width='100%' autoPlay controls>
				<source src={video} type='video/mp4' />
			</video>
		</Box>
	</Modal>
);

import React from "react";
import { 
	Box} from "@mui/material"
import { makeStyles } from '@mui/styles';
import SongDiscovery from "./SongDiscovery";

const useStyles = makeStyles(() => (
	{
		introBox: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
		},   
	}
))

export const Home = () => {
	const classes = useStyles();

	return (
		<Box display='flex' flexDirection='column'>
			<Box className={classes.introBox}>
				<SongDiscovery />
			</Box>
		</Box>
	)
};

export default Home;
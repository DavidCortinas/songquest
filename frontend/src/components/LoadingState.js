import { Box } from "@mui/material";
import spinningVinyl from '../images/vinyl-record-1.png'
import '../App.css';

export const LoadingState = () =>
    <Box display="flex" justifyContent="center" alignItems="center">
        <img src={spinningVinyl} alt="Spinning" className='spin' />
    </Box>
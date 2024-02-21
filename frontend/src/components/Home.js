import { 
    Box, 
    Button,  
    MobileStepper, 
    Typography, 
    useMediaQuery, 
    Grid,
    CardHeader} from "@mui/material"
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import theme from "../theme";
import { connect } from "react-redux";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import SongDiscovery from "./SongDiscovery";

const useStyles = makeStyles((theme) => (
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

export const Home = ({ onSearchPressed, onDataLoaded }) => {
    const classes = useStyles();
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const isSubscribed = false;

    return (
        <Box display='flex' flexDirection='column'>
            <Box className={classes.introBox}>
                <SongDiscovery />
            </Box>
        </Box>
    )
};

export default Home;
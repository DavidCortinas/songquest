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
        root: {
            flexGrow: 1,
        },
        card: {
            padding: theme.spacing(2),
            textAlign: 'center',
                width: '90%',
                height: '250px',
                padding: 10,
            color: 'white',
            background: 'transparent',
            [theme.breakpoints.down('sm')]: {
                width: '90%',
                height: '250px',
                padding: 10
            }
        },
        fourthCard: {
            marginTop: '2%',
            width: '92%',
            height: '200px',
            [theme.breakpoints.down('sm')]: {
                width: '90%',
                height: '250px'
            }
        },
        introBox: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        intro: {
            color: 'white',
            textAlign: 'center',
            width: '70%',
            [theme.breakpoints.down('sm')]: {
                width: '85%',
            },
        },
          link: {
            textDecoration: 'none', // Remove underline
            color: 'inherit', // Inherit text color from the parent
            '&:hover': {
            textDecoration: 'none', // Remove underline on hover
            },
        },
        subIntro: {
            color: 'white',
            width: '70%',
            textAlign: 'center',
            [theme.breakpoints.down('sm')]: {
                width: '85%',
            },
            marginTop: '15px',
        },
        optionsContainerColumns: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '35rem',
            margin: 'auto',
            padding: '0',
            height: '15rem',
        },  
        optionsContainerRows: {
            display: 'inline-flex',
            justifyContent: 'space-between',
            width: '70%',
            margin: '5% auto',
            height: '200px',
            paddingLeft: '1%',
        }, 
        optionsBox: {
            // textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '80%', // Adjust as needed
            margin: '0 2%', // Add some margin between the boxes
        },
        optionsBar: {
            textAlign: 'center',
            width: '90%',
            margin: 'auto',
            height: '75px'
        },
        optionsLink: {
            textDecoration: 'none',
            width: '100%',
            display: 'flex',
        },
        optionsLinkDisabled: {
            textDecoration: 'none',
            width: '100%',
            display: 'flex',
            opacity: '0.5',
        },
        optionsCard: {
            width: '100%',
            backgroundColor: 'white',
            flexDirection: 'column',
            border: '1px solid #b0b0b0',
        },
        optionsCardDisabled: {
            width: '100%',
            backgroundColor: 'white',
            flexDirection: 'column',
            border: '1px solid #b0b0b0',
            opacity: '0.5',
        },
        optionsText: {
            color: '#006f96',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50%',
            padding: '5px',
        },      
        optionsIcon: {
            color: '#000000',
        },      
    }
))

export const Home = ({ currentUser, onSearchPressed, onDataLoaded }) => {
    const classes = useStyles();
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const isSubscribed = false;

    return (
        <Box display='flex' flexDirection='column'>
            <Box className={classes.introBox}>
                <SongDiscovery 
                    onSearchPressed={onSearchPressed}
                    onDataLoaded={onDataLoaded}
                />
            </Box>
        </Box>
    )
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser?.user,
});

export default connect(mapStateToProps)(Home);
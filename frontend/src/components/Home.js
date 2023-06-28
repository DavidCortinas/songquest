import { Box, Card, Typography, useMediaQuery } from "@mui/material"
import { makeStyles } from '@mui/styles';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio'
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import theme from "../theme";

const useStyles = makeStyles((theme) => (
    {
        introBox: {
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '1rem',
        },
        intro: {
            color: '#3d3d3d',
            paddingTop: '1rem',
            justifyContent: 'center',
            textAlign: 'center',
            width: '70%',
            [theme.breakpoints.down('sm')]: {
                width: '85%',
            },
            marginTop: '30px',
        },
        optionsContainerColumns: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '70%',
            margin: '5% auto',
            height: '200px',
            paddingLeft: '1%',
        },  
        optionsContainerRows: {
            display: 'inline-flex',
            justifyContent: 'space-between',
            width: '70%',
            margin: '5% auto',
            height: '200px',
            paddingLeft: '1%',
            display: ''
        },  
        optionsBox: {
            textAlign: 'center',
            display: 'flex',
            width: '30%',
        },
        optionsBar: {
            textAlign: 'center',
            display: 'flex',
            width: '70%',
            margin: '30px auto',
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

export const Home = () => {
    const classes = useStyles();
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));
    console.log(theme)

    return (
        <Box display='flex' flexDirection='column'>
            <Box className={classes.introBox}>
                <Typography className={classes.intro} variant={isXsScreen || isSmScreen ? "body1" : "h6"}>
                    {isXsScreen || isSmScreen
                    ? "How can SongQuest help you?"
                    : "Clearing a song is hard enough as it is. Let SongQuest help you get started with your journey. How can we help to move things along?"
                    }
                </Typography>
            </Box>
            <Box className={isXsScreen || isSmScreen  
                ? classes.optionsContainerRows 
                : classes.optionsContainerColumns
            }>
                <Box className={isXsScreen || isSmScreen
                    ? classes.optionsBar 
                    : classes.optionsBox
                }>
                    <Link to='/search' className={classes.optionsLink}>
                        <Card className={classes.optionsCard}>
                            <Typography 
                                className={classes.optionsText}
                                variant={isSmScreen || isXsScreen
                                ? 'caption'
                                : null
                                }
                            >
                                Find Who Owns The Rights To A Song With Song Search
                            </Typography>
                            <SearchIcon className={classes.optionsIcon}/>
                        </Card>
                    </Link>
                </Box>
                <Box className={isXsScreen || isSmScreen
                    ? classes.optionsBar 
                    : classes.optionsBox
                }>
                    <Link className={classes.optionsLinkDisabled}>
                        <Card className={classes.optionsCard}>
                            <Typography 
                                className={classes.optionsText}
                                variant={isSmScreen || isXsScreen
                                ? 'caption'
                                : null
                                }
                            >
                                Find The Name Of A Song With Song Detection
                            </Typography>
                            <SpatialAudioIcon className={classes.optionsIcon}/>
                        </Card>
                    </Link>
                </Box>
                <Box className={isXsScreen || isSmScreen
                    ? classes.optionsBar 
                    : classes.optionsBox
                }>
                    <Link className={classes.optionsLinkDisabled}>
                        <Card className={classes.optionsCard}>
                            <Typography 
                                className={classes.optionsText}
                                variant={isSmScreen || isXsScreen
                                ? 'caption'
                                : null
                                }
                            >
                                Review Your Saved Searches
                            </Typography>
                            <SavedSearchIcon className={classes.optionsIcon}/>
                        </Card>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
};
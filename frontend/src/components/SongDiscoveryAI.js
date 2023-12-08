import { Box, Typography, useMediaQuery } from "@mui/material"
import { makeStyles, useTheme } from "@mui/styles";
import { Body } from "./Home";

const useStyles = makeStyles((theme) => (
    {
        form: {
            display: 'flex',
            flexDirection: 'column',
            color: "#007fbf",
            // backgroundColor: "white",
            width: '90%',
            marginTop: '30px',
        },
    }
))

export const SongDiscoveryAI = () => {
    const theme = useTheme();
    const classes = useStyles();

    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    return (
        <>
            <Box
                sx={{
                // minHeight: '20rem',
                width: '100%',
                // backgroundImage: 'linear-gradient(to bottom right, #004b7f, #006f96, #0090c3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                }}
            >
                <form className={classes.form} onSubmit={() => console.log('Discover AI Submit')}>
                    <Typography 
                        color='white' 
                        textAlign='center'
                        paddingBottom='5px'
                        variant={isXsScreen || isSmScreen ?
                        "body2" :
                        "body1"}
                    >
                        This is the OpenAI Song Discovery Component
                    </Typography>
                </form>
            </Box>
            <Body 
                isSmScreen={isSmScreen} 
                isXsScreen={isXsScreen}
                isMdScreen={isMdScreen}
                isLgScreen={isLgScreen} 
                isXlScreen={isXlScreen} 
            />
        </>
    )
}
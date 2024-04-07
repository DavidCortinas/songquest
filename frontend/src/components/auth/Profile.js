import { connect } from "react-redux";
import { 
    Avatar, 
    Box, 
    CardHeader, 
    TextField, 
    useMediaQuery 
} from "@mui/material";
import useStyles from "classes/playlist";
import theme from "theme";
import { toCapitalCase } from "utils";

export const Profile = ({
    currentUser,
}) => {
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    const classes = useStyles();

    return (
      <Box
        sx={{
            margin: 'auto',
            padding: { xs: '5%', sm: '3%', md: '2%' },
            width: { xs: '80%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
            height: 'auto',
            maxWidth: '768px',
            maxHeight: '650px',
            aspectRatio: '4 / 5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '18px',
            background: 'rgba(48, 130, 164, 0.15)',
            boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
        }}
      >
        <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-around'
            width='100%'
            p={2}
        >
            <Box
                sx={{
                position: 'relative',
                width: 'calc(200px + 26px)',  // Avatar size plus gradient border
                height: 'calc(200px + 26px)', // Avatar size plus gradient border
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                background: `radial-gradient(
                    at bottom right,
                    rgba(0, 0, 0, 1) 0%,
                    rgba(40, 42, 53, 0.8) 40%,
                    rgba(48, 49, 61, 0.8) 75%,
                    rgba(128, 128, 128, 0.6) 100%
                )`,
                padding: '3px',  // Controls the thickness of the gradient border
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-3px', // Align with the outer border
                    left: '-3px', // Align with the outer border
                    right: '-3px', // Align with the outer border
                    bottom: '-3px', // Align with the outer border
                    borderRadius: '50%',
                    zIndex: -1,
                },
                }}
            >
                <Avatar
                    src={
                    currentUser?.user?.profileImage ? 
                    currentUser?.user?.profileImage : 
                    "/path/to/nonexistent/image.jpg"
                    }
                    alt={currentUser?.user?.displayName}
                    sx={{
                    width: 200,
                    height: 200,
                    }}
                />
            </Box>
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='space-around'
                p={'2% 0'}
            >
                <TextField 
                    label={'Display Name'}
                    variant="standard"
                    disabled
                    value={currentUser?.user.displayName}
                    sx={{
                        maxHeight: '35px',
                        width: '25vw',
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        backgroundColor: '#30313d',
                        color: 'white',
                        borderRadius: '18px',
                        boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
                        '.MuiInputBase-input.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)'
                        },
                    }}
                    InputLabelProps={{ 
                        style: { 
                            margin: '2px 3%',
                            color: 'white', 
                        },
                        sx: {
                            color: 'white',
                            backgroundColor: '#30313d',
                        },
                    }}
                    InputProps={{ 
                        disableUnderline: 'true', 
                        style: { 
                            margin: '2px 3%', 
                            padding: '2% 0', 
                            fill: 'white',
                        },
                        sx: {
                            color: 'white'
                        },
                    }}
                />
                <TextField 
                    label={'Email'}
                    variant="standard"
                    value={currentUser?.user.email}
                    disabled
                    sx={{
                        maxHeight: '35px',
                        width: '25vw',
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        input: {
                            color: 'white',
                        },
                        backgroundColor: '#30313d',
                        color: 'white',
                        borderRadius: '18px',
                        boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
                        '.MuiInputBase-input.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)'
                        },
                    }}
                    InputLabelProps={{ 
                        style: { 
                            margin: '2px 3%',
                            color: 'white', 
                        },
                        sx: {
                            color: 'white',
                            backgroundColor: '#30313d',
                        },
                    }}
                    InputProps={{ 
                        disableUnderline: 'true', 
                        style: { 
                            margin: '2px 3%', 
                            padding: '2% 0', 
                            fill: 'white',
                        },
                        sx: {
                            color: 'white'
                        },
                    }}
                />
                <TextField 
                    label={'Birth Date'}
                    variant="standard"
                    value={currentUser?.user.birthday}
                    disabled
                    sx={{
                        maxHeight: '35px',
                        width: '25vw',
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        input: {
                            color: 'white',
                        },
                        backgroundColor: '#30313d',
                        color: 'white',
                        borderRadius: '18px',
                        boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
                        '.MuiInputBase-input.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)'
                        },
                    }}
                    InputLabelProps={{ 
                        style: { 
                            margin: '2px 3%',
                            color: 'white', 
                        },
                        sx: {
                            color: 'white',
                            backgroundColor: '#30313d',
                        },
                    }}
                    InputProps={{ 
                        disableUnderline: 'true', 
                        style: { 
                            margin: '2px 3%', 
                            padding: '2% 0', 
                            fill: 'white',
                        },
                        sx: {
                            color: 'white'
                        },
                    }}
                />
            </Box>
            </Box>
            <Box
                display='flex'
                flexDirection='row'
                justifyContent='space-around'
                width='100%'
            >
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='space-around'
                >
                    User Details
                </Box>
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='space-around'
                >
                    Preferred Genres
                </Box>
            </Box>
            <Box
                display='flex'
                flexDirection='row'
            >
                Spotify Connection
            </Box>
        </Box>
    )
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(Profile);
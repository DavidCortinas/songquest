import { connect } from "react-redux";
import { 
    Autocomplete,
    Avatar, 
    Box, 
    Card,
    Chip,
    TextField, 
    Typography,
    keyframes,
    useMediaQuery 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useStyles from "classes/playlist";
import theme from "theme";
import { toCapitalCase } from "utils";
import { useState } from "react";

const root = {
  "& .MuiAutocomplete-option[data-focus='true']": {
    backgroundColor: '#40444d',
    color: 'white',
  },
  "& .MuiAutocomplete-option:hover": {
    backgroundColor: '#40444d',
    color: 'white',
  },
};

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Profile = ({
    currentUser,
    genres,
}) => {
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    const classes = useStyles();
    const navigate = useNavigate();

    const [selectedGenres, setSelectedGenres] = useState([]);

    const handleChange = (event, newValue) => {
        setSelectedGenres(newValue);
    };

    const handleConnectThroughSpotify = async (e) => {
      e.preventDefault();

      const authorizationUrl = `http://localhost:8000/request-authorization/`;

      window.location.href = authorizationUrl;
    };

    console.log(genres);

    const genreOptions = genres.map(genre => toCapitalCase(genre));

    console.log(genreOptions);

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
            justifyContent: 'space-around',
            alignItems: 'center',
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '18px',
            background: 'rgba(48, 130, 164, 0.15)',
            boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
        }}
      >
        <Typography
            variant='h5'
            color={theme.palette.primary.whitesmoke}
            letterSpacing='50px'
            textAlign='center'
            paddingLeft='10%'
        >
            {'PROFILE'}
        </Typography>
        <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            width='100%'
        >
            <Box
            sx={{
                position: 'relative',
                width: 'calc(200px + 26px)', // Avatar size plus gradient border
                height: 'calc(200px + 26px)', // Avatar size plus gradient border
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                padding: '3px', // Controls the thickness of the gradient border
                '&::before, &::after': {
                content: '""',
                position: 'absolute',
                borderRadius: '50%',
                zIndex: -1,
                },
                '&::before': {
                top: '-3px', // Align with the outer border
                left: '-3px', // Align with the outer border
                right: '-3px', // Align with the outer border
                bottom: '-3px', // Align with the outer border
                background: `radial-gradient(
                    at bottom right,
                    rgba(0, 0, 0, 1) 0%,
                    rgba(40, 42, 53, 0.8) 40%,
                    rgba(48, 49, 61, 0.8) 75%,
                    rgba(128, 128, 128, 0.6) 100%
                )`,
                animation: `${rotate} 17s linear infinite`, // Apply the animation
                },
                '&::after': {
                width: '8px', // Size of the white dot
                height: '8px', // Size of the white dot
                background: 'white',
                // Position the dot initially at the top center of the border
                top: '-8px', // Slightly more than the padding to sit on the gradient border
                left: '48%',
                // Adjust the transform origin to the center of the avatar
                transform: 'translate(-50%, 0) rotate(0deg)', // Centers the dot
                transformOrigin: '50% calc(100% + 116px)', // Move the origin to the bottom center of the box
                animation: `${rotate} 35s linear infinite`,
                zIndex: 1, // Ensures the dot is above the gradient but below the avatar
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
                <Typography
                    color={'white'}
                    sx={{ 
                        mt: 1,
                        letterSpacing: '2px' 
                    }}
                    variant='h6'
                >
                    {`User Info:`}
                </Typography>
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
                            WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)',
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
                            letterSpacing: '1px'
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
                            color: 'white',
                            letterSpacing: '1px'
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
                            letterSpacing: '1px'
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
                            color: 'white',
                            letterSpacing: '1px'
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
                            letterSpacing: '1px'
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
                            color: 'white',
                            letterSpacing: '1px'
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
                    justifyContent='center'
                    alignItems='flex-start'
                    width='100%'
                    paddingLeft={2}
                >
                    <Typography
                        color={'white'}
                        variant='h6'
                        sx={{ 
                            my: 2,
                            letterSpacing: '2px' 
                        }}
                    >
                        {`User Details:`}
                    </Typography>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='flex-start'
                        width='100%'
                        mt={-2}
                    >
                        <TextField 
                            label={'User Type'}
                            variant="standard"
                            value={toCapitalCase(currentUser?.user.userType)}
                            disabled
                            sx={{
                                my: 1,
                                maxHeight: '35px',
                                width: '90%',
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
                                    letterSpacing: '1px'
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
                                    color: 'white',
                                    letterSpacing: '1px'
                                },
                            }}
                        />
                        <TextField 
                            label={'Profession'}
                            variant="standard"
                            value={currentUser?.user.profession || '*Only applies to professional users'}
                            disabled
                            sx={{
                                my: 1,
                                maxHeight: '35px',
                                width: '90%',
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
                                    letterSpacing: '1px'
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
                                    color: 'white',
                                    letterSpacing: '1px'
                                },
                            }}
                        />
                        <TextField 
                            label={'XP'}
                            variant="standard"
                            value={`${currentUser?.user.xp}/1000`}
                            // {`${displayXp}/${maxXp}xp`}
                            disabled
                            sx={{
                                my: 1,
                                maxHeight: '35px',
                                width: '90%',
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
                                    letterSpacing: '1px'
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
                                    color: 'white',
                                    letterSpacing: '1px'
                                },
                            }}
                        />
                        <TextField 
                            label={'Tokens'}
                            variant="standard"
                            value={currentUser?.user.tokens}
                            disabled
                            sx={{
                                my: 1,
                                maxHeight: '35px',
                                width: '90%',
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
                                    letterSpacing: '1px'
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
                                    color: 'white',
                                    letterSpacing: '1px'
                                },
                            }}
                        />  
                    </Box>
                </Box>
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='flex-start'
                    alignItems='flex-start'
                    width='100%'
                    pt={2}
                >
                    <Typography
                        color={'white'}
                        variant='h6'
                        sx={{ 
                            mt: 2, 
                            mb: 1,
                            letterSpacing: '2px'
                        }}
                    >
                        {`Preferred Genres:`}
                    </Typography>
                    <Autocomplete 
                        freeSolo
                        multiple
                        disabled
                        filterSelectedOptions
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        value={currentUser?.user.preferredGenres.map(genre => toCapitalCase(genre))}
                        onChange={handleChange}
                        options={genreOptions}
                        ListboxProps={{
                            sx: {
                                ...root,
                                padding: 0,
                            }
                        }}
                        className={classes.textField}
                        sx={{ 
                            maxHeight: '68%' 
                        }}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                sx={{
                                    justifyContent: 'space-between',
                                    background: '#30313d',
                                    color: 'white',
                                }}
                                {...props}
                            >
                                {option}
                            </Box>
                        )}
                        ChipProps={{
                            sx: {
                                color: 'white',
                                backgroundColor: '#006f96',
                                '& .MuiChip-deleteIcon': {
                                    color: 'white',
                                },
                                '& .MuiChip-deleteIcon:hover': {
                                    color: '#00435a',
                                },
                            }       
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Select Genres"}
                                variant="standard"
                                InputLabelProps={{
                                    sx: {
                                        paddingLeft: '1em',
                                        // backgroundColor: '#30313d',
                                        color: 'white',
                                        letterSpacing: '1px'
                                    },
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    style: { 
                                        margin: '5px 0', 
                                        padding: '5px 10px', 
                                        fill: 'white',
                                    },
                                    sx: {
                                        ...params.InputProps.sx,
                                        color: 'white',
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                            fontSize: '1.25rem',
                                        },
                                        '&:before': { 
                                            borderBottom: 'none',
                                        },
                                        '&:hover:not(.Mui-disabled):before': {
                                            borderBottom: 'none',
                                        },
                                    },
                                }}
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexWrap: 'wrap', 
                                    overflow: 'auto', 
                                    maxHeight: '12em' 
                                }}>
                                {value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{
                                            color: 'white',
                                            backgroundColor: '#006f96',
                                            '& .MuiChip-deleteIcon': {
                                                color: 'white',
                                            },
                                            '& .MuiChip-deleteIcon:hover': {
                                                color: '#00435a',
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        }
                    />
                </Box>
            </Box>
            <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
            >
                {!currentUser?.user.spotifyConnected ? (
                    <>
                        <Box
                            sx={{
                            width: '40px', // Adjust the size as needed
                            height: '40px', // Ensure this is the same as width for a circle
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%', // Makes the box circular
                            overflow: 'hidden', // Ensures nothing spills outside the circle
                            marginRight: '16px', // Adds spacing between icon and text
                            }}
                        >
                            <img
                            src='/static/images/Spotify_Icon_RGB_Green.png'
                            style={{
                                width: '100%', // Makes the image fill the container
                                height: 'auto', // Maintains aspect ratio
                            }}
                            />
                        </Box>
                        <Typography
                            color={'white'}
                            sx={{ mt: 2, mb: 1 }}
                            variant='h6'
                            letterSpacing='1px'
                        >
                            {`Connected to Spotify`}
                        </Typography>
                    </>
                ) : (
                    <Card
                      onClick={handleConnectThroughSpotify}
                      className={classes.panelCard}
                      style={{
                        display: 'flex',
                        margin: '0 auto',
                      }}
                    >
                      <Box padding='0 5% 0'>
                        <Typography 
                          variant='subtitle1' 
                          textAlign='center' 
                          letterSpacing='2px'
                          color='white'
                          sx={{
                            fontWeight: 'bold',
                            maxHeight: '30%',
                            maxWidth: '100%',
                            overflowY: 'auto',
                            cursor: 'pointer',
                          }}
                          >
                          {'Connect to Spotify'}
                        </Typography>
                      </Box> 
                      <img 
                        src='/static/images/Spotify_Icon_RGB_White.png' 
                        style={{ 
                          maxWidth: '8%', 
                          height: 'auto',
                        }}
                      />
                    </Card>
                )
            }
            </Box>
        </Box>
    )
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    genres: state.discovery.genres,
  };
};

export default connect(mapStateToProps)(Profile);
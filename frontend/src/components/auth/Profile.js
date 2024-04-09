import { connect } from "react-redux";
import { 
    Autocomplete,
    Avatar, 
    Box,
    Button, 
    Card,
    Chip,
    TextField, 
    Tooltip,
    Typography,
    keyframes,
    useMediaQuery 
} from "@mui/material";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
import { useNavigate } from "react-router-dom";
import useStyles from "classes/playlist";
import theme from "theme";
import { toCapitalCase } from "utils";
import { useEffect, useRef, useState } from "react";
import { handleUpdateBirthday, handleUpdateDisplayName, handleUpdatePreferredGenres, handleUpdateProfileImage, handleUpdateUserProfession, handleUpdateUserType } from "thunks";

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

const AddImageIcon = () => (
    <AddAPhotoIcon 
        style={{ 
            fontSize: 80,
            color: 'rgb(210,220,225, 0.6)' 
        }} 
    />
);

const UserInfo = ({
    fieldLabel,
    fieldValue,
    handleValueChange
}) => {
    const hasValue = Boolean(fieldValue);
    const [fieldDisabled, setFieldDisabled] = useState(true);

    const handleEditClick = () => {
        setFieldDisabled(!fieldDisabled)
    };

    const textFieldRef = useRef(null);

    useEffect(() => {
    if (!fieldDisabled && textFieldRef.current) {
        const input = textFieldRef.current.querySelector('input');
        if (input) {
        input.focus();
        }
    }
    }, [fieldDisabled]);

    return (
        <Box
            display='flex'
            alignItems='center'
        >
            <TextField
                ref={textFieldRef}
                label={fieldLabel}
                variant="standard"
                disabled={fieldDisabled}
                value={fieldValue}
                onChange={handleValueChange}
                onBlur={() => setFieldDisabled(true)}
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
                    ...(hasValue ? {
                    input: {
                        color: 'white',
                    },
                    } : {
                    '.MuiInputBase-input': {
                        padding: '8px 0', // Specific style for when there is no value
                    },
                    }),
                }}
                InputLabelProps={{
                    ...(hasValue ? {
                    style: {
                        margin: '2px 3%',
                        color: 'white',
                    },
                    } : {
                    sx: {
                        color: 'white',
                        transform: 'translate(14px, 10px) scale(1)',
                        '&.Mui-focused': {
                        transform: 'translate(14px, -6px) scale(0.75)',
                        },
                        '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -6px) scale(0.75)',
                        },
                        backgroundColor: '#30313d',
                        letterSpacing: '1px',
                        maxWidth: 'calc(100% - 24px)',
                    },
                    })
                }}
                InputProps={{
                    disableUnderline: true,
                    ...(hasValue ? {
                    style: {
                        margin: '2px 3%',
                        padding: '2% 0',
                        fill: 'white',
                    },
                    sx: {
                        color: 'white',
                        letterSpacing: '1px',
                    },
                    } : {
                    sx: {
                        paddingLeft: '14px',
                    },
                    }),
                }}
            />
            {fieldLabel !== 'Email' && <Tooltip
                title={
                    <div
                        style={{
                            maxHeight: '25vh',
                            overflowY: 'auto',
                            padding: '8px',
                            borderRadius: '18px',
                        }}
                    > 
                        <Typography variant='body2' letterSpacing='1px'>
                            {fieldValue ? `Edit ${fieldLabel}` : `Add ${fieldLabel}`}
                        </Typography>
                    </div>
                }
            >
                {fieldValue? (
                    <EditIcon
                        onClick={handleEditClick} 
                        sx={{
                            paddingLeft: '1%',
                            color: 'white',
                            opacity: '0.7',
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: '1',
                            }
                        }}
                    />
                ) : (
                    <AddCircleIcon
                        // onClick={handleAddTokens} 
                        sx={{
                            paddingLeft: '1%',
                            color: 'white',
                            opacity: '0.7',
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: '1',
                            }
                        }}
                    />
                )}
            </Tooltip>}
        </Box>
    )
};

const UserDetailsField = ({ 
    label, 
    value,
    hasValue,
    handleValueChange,
    fieldDisabled,
    setFieldDisabled,
}) => {
    const textFieldRef = useRef(null);

    useEffect(() => {
    if (!fieldDisabled && textFieldRef.current) {
        const input = textFieldRef.current.querySelector('input');
        if (input) {
        input.focus();
        }
    }
    }, [fieldDisabled]);

    return (
        <TextField 
            ref={textFieldRef}
            label={label}
            variant="standard"
            value={value}
            disabled={fieldDisabled}
            onChange={handleValueChange}
            onBlur={() => setFieldDisabled(true)}
            sx={{
                my: 1,
                maxHeight: '35px',
                width: '90%',
                [theme.breakpoints.down('sm')]: {
                    width: '80%',
                },
                backgroundColor: '#30313d',
                borderRadius: '18px',
                boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
                '.MuiInputBase-input.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)',
                },
                ...(hasValue ? {} : {
                    '.MuiInputBase-input': {
                        padding: '8px 0',
                    },
                }),
                color: 'white',
            }}
            InputLabelProps={{ 
                ...(hasValue ? {
                style: {
                    margin: '2px 3%',
                    color: 'white', 
                },
                } : {
                sx: {
                    color: 'white',
                    transform: 'translate(14px, 10px) scale(1)',
                    '&.Mui-focused': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                    },
                    '&.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                    },
                    backgroundColor: '#30313d',
                    letterSpacing: '1px',
                    maxWidth: 'calc(100% - 24px)',
                },
                })
            }}
            InputProps={{ 
                disableUnderline: true,
                ...(hasValue ? {
                style: {
                    margin: '2px 3%',
                    padding: '2% 0',
                    fill: 'white',
                },
                sx: {
                    color: 'white',
                    letterSpacing: '1px',
                },
                } : {
                sx: {
                    paddingLeft: '14px',
                },
                }),
            }}
        />
    );
};

const UserDetails = ({
    fieldLabel,
    fieldValue,
    handleValueChange,
    handleClick,
    userType
}) => {
    const hasValue = Boolean(fieldValue);

    const [fieldDisabled, setFieldDisabled] = useState(true);

    const handleEditClick = () => {
        setFieldDisabled(!fieldDisabled)
    };

    const userTypeOptions = ['Fan', 'Professional']

    return (
        <Box
            display='flex'
            alignItems='center'
        >
            {fieldLabel === 'User Type' ? 
                (
                    <Autocomplete 
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        value={fieldValue}
                        disabled={fieldDisabled}
                        // onChange={handleChange}
                        options={userTypeOptions}
                        ListboxProps={{
                            sx: {
                                ...root,
                                padding: 0,
                            }
                        }}
                        sx={{
                            width: '100%',
                            maxHeight: '35px',
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
                                label="Select User Type"
                                variant="standard"
                                InputLabelProps={{
                                    sx: {
                                        paddingLeft: '1em',
                                        // backgroundColor: '#30313d',
                                        color: 'white',
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
                                            fontSize: '1rem',
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
                    />
                ) : (
                    <UserDetailsField
                        label={fieldLabel}
                        value={fieldValue}
                        hasValue={hasValue}
                        handleValueChange={handleValueChange}
                        fieldDisabled={fieldDisabled}
                        setFieldDisabled={setFieldDisabled}
                    />
                )
            }
            <Tooltip
                title={
                    <div
                        style={{
                            maxHeight: '25vh',
                            overflowY: 'auto',
                            padding: '8px',
                            borderRadius: '18px',
                        }}
                    > 
                        <Typography variant='body2' letterSpacing='1px'>
                            {fieldValue && fieldLabel !== 'Tokens' ? 
                                `Edit ${fieldLabel}` : 
                                fieldLabel === 'Tokens' ?
                                `Get more tokens` :
                                fieldLabel === 'Profession' && userType === 'Fan' ?
                                `This field only applies to professional users` :
                                `Add ${fieldLabel}`
                            }
                        </Typography>
                    </div>
                }
            >
                {fieldValue && fieldLabel !== 'Tokens' ? (
                    <EditIcon
                        onClick={handleEditClick} 
                        sx={{
                            paddingLeft: '1%',
                            color: 'white',
                            opacity: '0.7',
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: '1',
                            }
                        }}
                    />
                ) : (
                    <AddCircleIcon
                        onClick={handleClick} 
                        sx={{
                            paddingLeft: '1%',
                            color: fieldLabel === 'Profession' && userType === 'Fan' ? 
                                'rgb(210,220,225, 0.6)' :
                                theme.palette.primary.main,
                            opacity: '0.7',
                            cursor: !(fieldLabel === 'Profession' && userType === 'Fan') && 'pointer',
                            '&:hover': {
                                opacity: !(fieldLabel === 'Profession' && userType === 'Fan') && '1',
                            }
                        }}
                    />
                )}
            </Tooltip>
        </Box>
    )
};

export const Profile = ({
    currentUser,
    genres,
    onUpdateDisplayName
}) => {
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    const classes = useStyles();
    const navigate = useNavigate();

    const [selectedGenres, setSelectedGenres] = useState([]);
    
    const [displayNameValue, setDisplayNameValue] = useState(null);
    const [birthDateValue, setBirthDateValue] = useState(null);

    const [userTypeValue, setUserTypeValue] = useState(null);
    const [professionValue, setProfessionValue] = useState(null);

    useEffect(() => {
        if (currentUser?.user?.displayName) {
            setDisplayNameValue(currentUser?.user?.displayName);
        }
    }, [currentUser?.user?.displayName]);

    useEffect(() => {
        if (currentUser?.user?.birthday) {
            setBirthDateValue(currentUser?.user?.birthday); 
        }
    }, [currentUser?.user?.birthday]);

    useEffect(() => {
        if (currentUser?.user?.userType) {
            setUserTypeValue(toCapitalCase(currentUser?.user?.userType)); 
        }
    }, [currentUser?.user?.userType]);

    useEffect(() => {
        if (currentUser?.user?.professionValue) {
            setProfessionValue(currentUser?.user?.professionValue); 
        }
    }, [currentUser?.user?.professionValue]);

    const handleDisplayNameChange = (e) => {
        setDisplayNameValue(e.target.value);
    };

    const handleBirthDateChange = (e) => {
        setBirthDateValue(e.target.value);
    };

    const handleUserTypeChange = (e) => {
        setUserTypeValue(e.target.value);
    };
    const handleProfessionChange = (e) => {
        setProfessionValue(e.target.value);
    };

    const handleGenreChange = (event, newValue) => {
        setSelectedGenres(newValue);
    };

    const handleConnectThroughSpotify = async (e) => {
      e.preventDefault();

      const authorizationUrl = `http://localhost:8000/request-authorization/`;

      window.location.href = authorizationUrl;
    };

    const handleAddTokens = () => {
        navigate('/pricing');
    };

    const genreOptions = genres.map(genre => toCapitalCase(genre));

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
                <UserInfo 
                    fieldLabel={'Display Name'}
                    fieldValue={displayNameValue}
                    handleValueChange={handleDisplayNameChange}
                />
                <UserInfo 
                    fieldLabelabel={'Birth Date'}
                    fieldValue={birthDateValue}
                    handleValueChange={handleBirthDateChange}
                />
                <UserInfo 
                    fieldLabel={'Email'}
                    fieldValue={currentUser?.user?.email}
                    handleValueChange={null}
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
                    width='85%'
                    paddingLeft={1}
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
                        width='95%'
                        mt={-2}
                    >
                        <UserDetails
                            fieldLabel={'User Type'}
                            fieldValue={userTypeValue}
                            userType={userTypeValue}
                            handleValueChange={handleUserTypeChange}
                            handleClick={null}
                        /> 
                        <UserDetails
                            fieldLabel={'Profession'}
                            fieldValue={professionValue}
                            userType={userTypeValue}
                            handleValueChange={handleProfessionChange}
                            handleClick={null}
                        />           
                        <UserDetails
                            fieldLabel={'Tokens'}
                            fieldValue={currentUser?.user?.tokens}
                            userType={userTypeValue}
                            handleValueChange={null}
                            handleClick={handleAddTokens}
                        />           
                        <UserDetailsField 
                            label={'XP'}
                            value={`${currentUser?.user?.xp}/1000`}
                            hasValue={true}
                            handleValueChange={null}
                            fieldDisabled={true}
                            setFieldDisabled={null}
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
                    {currentUser.user && (<Autocomplete 
                        freeSolo
                        multiple
                        disabled
                        filterSelectedOptions
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        value={currentUser?.user?.preferredGenres?.map(genre => {
                            if (typeof genre === 'string') {
                                return toCapitalCase(genre);
                            } else if (typeof genre === 'object' && genre !== null && genre.name) {
                                return toCapitalCase(genre.name);
                            } else {
                                return null;
                            }
                        })}
                        onChange={handleGenreChange}
                        options={genreOptions || []}
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
                    />)}
                </Box>
            </Box>
            <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                pb={1}
            >
                {currentUser?.user?.spotifyConnected ? (
                    <Box
                        display='flex'
                        alignItems='center'
                    >
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
                            variant='h6'
                            letterSpacing='1px'
                        >
                            {`Connected to Spotify`}
                        </Typography>
                        <Tooltip
                            title={
                                <div
                                    style={{
                                    maxHeight: '25vh',
                                    overflowY: 'auto',
                                    padding: '8px',
                                    borderRadius: '18px',
                                    }}
                                > 
                                    <Typography variant='body2' letterSpacing='1px'>
                                        {'Re-sync Spotify Connection'}
                                    </Typography>
                                </div>
                            }
                        >
                            <SyncIcon
                                onClick={handleConnectThroughSpotify}
                                sx={{
                                    paddingLeft: '10px',
                                    color: 'white',
                                    opacity: '0.7',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: '1',
                                    }
                                }}
                            />
                        </Tooltip>
                    </Box>
                ) : (
                    <Box>
                        <Typography
                            variant='subtitle2'
                            color='rgb(210,220,225, 0.8)'
                            textAlign='center'
                        >
                            {'You are not connected to Spotify'}
                        </Typography>
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
                    </Box>
                )}
            </Box>
            <Button
                type="submit"
                variant='contained'
                // onClick={handleSubmit(onSubmit)}
                className={classes.button}
                sx={(isSmScreen || isXsScreen) && {
                typography: {
                    fontSize: '12px'
                }
                }}
            >
                {'Save Updates'}
            </Button>
        </Box>
    )
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    genres: state.discovery.genres,
  };
};

const mapDispatchToProps= (dispatch) => ({
    onUpdateDisplayName: (userId, displayName) => dispatch(handleUpdateDisplayName(userId, displayName)),
    onUpdateBirthday: (userId, date) => dispatch(handleUpdateBirthday(userId, date)),
    onUpdatePreferredGenres: (userId, genres) => dispatch(handleUpdatePreferredGenres(userId, genres)),
    onUpdateUserType: (userId, userType) => dispatch(handleUpdateUserType(userId, userType)),
    onUpdateUserProfession: (userId, profession) => dispatch(handleUpdateUserProfession(userId, profession)),
    onUpdateProfileImage: (userId, imageFile) => dispatch(handleUpdateProfileImage(userId, imageFile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
import { useForm } from "react-hook-form";
import { useStyles } from "./classes";
import { useCallback, useEffect, useMemo, useState } from "react";
import theme from "theme";
import { Autocomplete, Box, Button, CardHeader, Grid, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { connect, useDispatch } from "react-redux";
import { SpotifyAuth, getSpotifyGenres, handleUpdateBirthday, handleUpdateDisplayName, handleUpdatePreferredGenres } from "thunks";

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

const DisplayNameInput = ({
    isXlScreen,
    isLgScreen,
    isMdScreen,
    isSmScreen,
    isXsScreen,
    classes,
    errors,
    register,
    handleSubmit,
    onUpdateDisplayName,
    currentUser,
    setCurrentStep,
}) => {

    const [displayNameValue, setDisplayNameValue] = useState('');
    const [invalidDisplayName, setInvalidDisplayName] = useState(false);

    const handleDisplayNameChange = (e) => {
        setInvalidDisplayName(false);
        setDisplayNameValue(e.target.value);
    };

    const onCreateDisplayName = async () => {
        if (!displayNameValue) {
            setInvalidDisplayName(true);
            return;
        };

        const savedDisplayName = await onUpdateDisplayName(currentUser?.user.id, displayNameValue);
        if (savedDisplayName) {
            setCurrentStep('birthday');
        };
    };

    return (
        <Box display='flex' justifyContent='center' paddingTop='1rem'>
            <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                    <form className={classes.form}>
                        <CardHeader
                            title="Welcome to SongQuest"
                            titleTypographyProps={{
                                width: '100%',
                                variant: isSmScreen || isXsScreen
                                ? 'h6'
                                : 'h5',
                                textAlign: 'center',
                                color: 'white',
                            }}
                            subheader="Enter a display name to get started on your profile"
                            subheaderTypographyProps={{ 
                                width: '100%', 
                                variant: isXlScreen || isLgScreen 
                                ? 'body1'
                                : 'body2',
                                textAlign: 'center',
                                color: 'white',
                            }}
                        />
                        <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                            <TextField 
                                autoFocus
                                variant="standard"
                                InputLabelProps={{ 
                                    style: { 
                                        margin: '2px 5px',
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
                                        margin: '5px', 
                                        padding: '5px 0', 
                                        fill: 'white',
                                    },
                                    sx: {
                                        color: 'white'
                                    },
                                }}
                                error={errors.display_name}
                                required
                                className={classes.textField}
                                value={displayNameValue}
                                label={errors.display_name ? "Invalid Display Name" : "Display Name"}
                                type="display-name"
                                {...register('display-name', 
                                    { 
                                        required: true, 
                                        onChange: (e) => handleDisplayNameChange(e),
                                        error: invalidDisplayName,
                                    })
                                }
                            />
                        </Box>
                        <br />
                        <br />
                        <Grid className={classes.buttonsContainer}>
                            <Tooltip
                                arrow
                                title={
                                <div
                                    style={{
                                    maxHeight: '25vh',
                                    overflowY: 'auto',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    }}
                                > 
                                    <Typography variant='body2' letterSpacing='1px'>
                                    {'Create display name and continue'}
                                    </Typography>
                                </div>
                                }
                            >
                                <Button
                                    type="submit"
                                    className={classes.button}
                                    onClick={handleSubmit(onCreateDisplayName)}
                                >
                                    Next
                                    <NavigateNextIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                        <br />
                    </form>
            </Box>
        </Box>    
    );
};

const BirthdayInput = ({
    classes,
    isXsScreen,
    isSmScreen,
    isMdScreen,
    isLgScreen,
    isXlScreen,
    handleSubmit,
    currentUser,
    setCurrentStep,
    onUpdateBirthday,
}) => {
    const [date, setDate] = useState(null);

    const onSaveBirthday = async () => {
       const savedBirthday = await  onUpdateBirthday(currentUser?.user.id, date);
        if (savedBirthday) {
            setCurrentStep('genres');
        };
    };

    return (
        <Box display='flex' justifyContent='center' paddingTop='1rem'>
            <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                    <form className={classes.form}>
                        <CardHeader
                            title={`Nice to meet you, ${currentUser.user.displayName}!`}
                            titleTypographyProps={{
                                width: '100%',
                                variant: isSmScreen || isXsScreen
                                ? 'h6'
                                : 'h5',
                                textAlign: 'center',
                                color: 'white',
                            }}
                            subheader="Please, enter your birthday to continue"
                            subheaderTypographyProps={{ 
                                width: '100%', 
                                variant: isXlScreen || isLgScreen 
                                ? 'body1'
                                : 'body2',
                                textAlign: 'center',
                                color: 'white',
                            }}
                        />
                        <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    label="Birthday"
                                    value={date}
                                    onChange={(newDate) => setDate(newDate)}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: 'white',
                                        },
                                        '& .MuiInputBase-root': {
                                            color: 'white',
                                            backgroundColor: '#30313d',
                                            borderRadius: '8px',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottomColor: 'transparent',
                                        },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                            borderBottomColor: 'transparent',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                        <br />
                        <br />
                        <Grid className={classes.buttonsContainer}>
                            <Tooltip
                                arrow
                                title={
                                <div
                                    style={{
                                    maxHeight: '25vh',
                                    overflowY: 'auto',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    }}
                                > 
                                    <Typography variant='body2' letterSpacing='1px'>
                                    {'Enter birthday and continue'}
                                    </Typography>
                                </div>
                                }
                            >
                                <Button
                                    type="submit"
                                    className={classes.button}
                                    onClick={handleSubmit(onSaveBirthday)}
                                >
                                    Next
                                    <NavigateNextIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                        <br />
                    </form>
            </Box>
        </Box>  
    );
};

const Genres = ({
    accessToken,
    expiresAt,
    classes,
    isXsScreen,
    isSmScreen,
    isMdScreen,
    isLgScreen,
    isXlScreen,
    genres,
    errors,
    register,
    handleSubmit,
    currentUser,
    setCurrentStep,
    onUpdatePreferredGenres,
}) => {
    const dispatch = useDispatch();
    const [genre, setGenre] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);

    useEffect(() => {
        dispatch(getSpotifyGenres(accessToken, expiresAt));
    }, [dispatch, accessToken, expiresAt]);

    const handleChange = (event, newValue) => {
        setSelectedGenres(newValue);
    };

    const onSaveGenres = async () => {
        console.log("Selected Genres:", selectedGenres);
        const preferredGenres = await onUpdatePreferredGenres(currentUser?.user.id, selectedGenres);
        if (preferredGenres) {
            setCurrentStep('userType');
        }
    };

    return (
        <Box display='flex' justifyContent='center' paddingTop='1rem'>
            <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                    <form className={classes.form}>
                        <CardHeader
                            title="Great, now for some insight into your taste..."
                            titleTypographyProps={{
                                width: '100%',
                                variant: isSmScreen || isXsScreen
                                ? 'h6'
                                : 'h5',
                                textAlign: 'center',
                                color: 'white',
                            }}
                            subheader="What genres do you usually prefer to listen to? This will help us customize your experience"
                            subheaderTypographyProps={{ 
                                width: '100%', 
                                variant: isXlScreen || isLgScreen 
                                ? 'body1'
                                : 'body2',
                                textAlign: 'center',
                                color: 'white',
                            }}
                        />
                        <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                            <Autocomplete 
                                freeSolo
                                multiple
                                filterSelectedOptions
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                value={selectedGenres}
                                onChange={handleChange}
                                disablePortal
                                options={genres}
                                ListboxProps={{ sx: root }}
                                className={classes.textField}
                                renderOption={(props, option) => {
                                    return (
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
                                    )
                                }}
                                ChipProps={{
                                    sx: {
                                        color: {
                                            color: 'white',
                                            backgroundColor: '#006f96',
                                            '& .MuiChip-deleteIcon': {
                                                color: 'white',
                                            },
                                            '& .MuiChip-deleteIcon:hover': {
                                                color: '#00435a',
                                            },
                                        }
                                    }       
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Genres"
                                        variant="standard"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        InputLabelProps={{
                                        sx: {
                                            paddingLeft: '1em',
                                            backgroundColor: '#30313d',
                                            color: 'white',
                                        },
                                        }}
                                        InputProps={{
                                        ...params.InputProps,
                                        sx: {
                                            ...params.InputProps.sx,
                                            paddingLeft: '1em',
                                            color: 'white',
                                            '& .MuiInputBase-input': {
                                            color: 'white',
                                            fontSize: '0.875rem'
                                            },
                                        },
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                        }}
                                    />
                                )}
                            />
                        </Box>
                        <br />
                        <br />
                        <Grid className={classes.buttonsContainer}>
                            <Tooltip
                                arrow
                                title={
                                <div
                                    style={{
                                    maxHeight: '25vh',
                                    overflowY: 'auto',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    }}
                                > 
                                    <Typography variant='body2' letterSpacing='1px'>
                                    {'Create display name and continue'}
                                    </Typography>
                                </div>
                                }
                            >
                                <Button
                                    type="submit"
                                    className={classes.button}
                                    onClick={handleSubmit(onSaveGenres)}
                                >
                                    Next
                                    <NavigateNextIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                        <br />
                    </form>
            </Box>
        </Box>    
    );
};

export const Onboard = ({ 
    onUpdateDisplayName, 
    onUpdateBirthday,
    onUpdatePreferredGenres,
    currentUser,
    genres,
}) => {
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    const [currentStep, setCurrentStep] = useState('displayName');

    const classes = useStyles();
    const { handleSubmit, register, formState: { errors } } = useForm();
    console.log(currentStep)
    console.log(currentUser)

    return currentStep === 'displayName' ? (
        <DisplayNameInput 
            isXlScreen={isXlScreen}
            isLgScreen={isLgScreen}
            isMdScreen={isMdScreen}
            isSmScreen={isSmScreen}
            isXsScreen={isXsScreen}
            classes={classes}
            errors={errors}
            register={register}
            handleSubmit={handleSubmit}
            onUpdateDisplayName={onUpdateDisplayName}
            currentUser={currentUser}
            setCurrentStep={setCurrentStep}
        />
    ) : currentStep === 'birthday' ? (
        <BirthdayInput 
            classes={classes}
            isXsScreen={isXsScreen}
            isSmScreen={isSmScreen}
            isMdScreen={isMdScreen}
            isLgScreen={isLgScreen}
            isXlScreen={isXlScreen}
            handleSubmit={handleSubmit}
            currentUser={currentUser}
            setCurrentStep={setCurrentStep}
            onUpdateBirthday={onUpdateBirthday}
        />
    ) : (
        <SpotifyAuth>
            {(accessToken, expiresAt) => {
                return (
                    <Genres
                        accessToken={accessToken}
                        expiresAt={expiresAt} 
                        classes={classes}
                        isXsScreen={isXsScreen}
                        isSmScreen={isSmScreen}
                        isMdScreen={isMdScreen}
                        isLgScreen={isLgScreen}
                        isXlScreen={isXlScreen}
                        genres={genres}
                        errors={errors}
                        currentUser={currentUser}
                        setCurrentStep={setCurrentStep}
                        register={register}
                        handleSubmit={handleSubmit}
                        onUpdatePreferredGenres={onUpdatePreferredGenres}
                    />
                )
            }}
        </SpotifyAuth>
    )
};

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    genres: state.discovery.genres,
});

const mapDispatchToProps= (dispatch) => ({
    onUpdateDisplayName: (userId, displayName) => dispatch(handleUpdateDisplayName(userId, displayName)),
    onUpdateBirthday: (userId, date) => dispatch(handleUpdateBirthday(userId, date)),
    onUpdatePreferredGenres: (userId, genres) => dispatch(handleUpdatePreferredGenres(userId, genres)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Onboard);
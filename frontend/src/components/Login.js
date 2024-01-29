import { 
    Box, 
    Button, 
    CardHeader, 
    Grid, 
    TextField, 
    useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import theme from '../theme'
import { makeStyles } from "@mui/styles";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { checkRegistration, getSpotifyUserAuth, handleUpdateUsername, login, registerUser } from "../thunks";
import { setCurrentUser } from "../actions";

const useStyles = makeStyles(() => (
  {
  card: {
    backgroundColor: "transparent",
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "transparent",
  },
  box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "transparent",
    marginBottom: '5%',
  },
  textField: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    input: {
        color: 'white',
    },
    backgroundColor: '#30313d',
    color: 'white',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  subHeader: {
    width: '40%',
    [theme.breakpoints.up('sm')]: {
      width: '25rem',
    },
  },
  description: {
    maxWidth: theme.breakpoints.up('xl') ? '65rem' : '50rem',
    color: '#6f6f71',
    paddingTop: '1rem',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  button: {
    color: 'white'
  },
  noBottomLine: {
    borderBottom: 'none',
  }
}));

const UsernameInput = ({
    isXlScreen,
    isLgScreen,
    isMdScreen,
    isSmScreen,
    isXsScreen,
    classes,
    errors,
    usernameValue,
    register,
    handleUsernameChange,
    invalidUsername,
    handleSubmit,
    onCreateUsername
}) => {

    return (
        <>
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
                                subheader="Enter a username to get started"
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
                                    error={errors.username}
                                    required
                                    className={classes.textField}
                                    value={usernameValue}
                                    label={errors.username ? "Invalid Username" : "username"}
                                    type="username"
                                    {...register('username', 
                                        { 
                                            required: true, 
                                            onChange: (e) => handleUsernameChange(e),
                                            error: invalidUsername,
                                        })
                                    }
                                />
                            </Box>
                            <br />
                            <br />
                            <Grid className={classes.buttonsContainer}>
                                <Button
                                    type="submit"
                                    className={classes.button}
                                    onClick={handleSubmit(onCreateUsername)}
                                >
                                    Next
                                    <NavigateNextIcon />
                                </Button>
                            </Grid>
                            <br />
                        </form>
                </Box>
            </Box>
        </>    
    );
};

export const Login = ({ onConnectThroughSpotify, onUpdateUsername, user }) => {
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    const classes = useStyles();

    const { handleSubmit, register, formState: { errors } } = useForm();
    
    const [emailValue, setEmailValue] = useState('');
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [checkedRegistration, setCheckedRegistration] = useState(false);
    const [userRegistered, setUserRegistered] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [usernameCreated, setUsernameCreated] = useState(Boolean(user?.user));
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);
    // const [spotifyAuthorized, setSpotifyAuthorized] =  useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.user.username) {
            setUsernameCreated(true);
        };
    }, [user])

    const onEmailSubmit = async () => {
        if (!emailValue) {
            setInvalidEmail(true);
            return;
        }
        setCheckedRegistration(true);

        try {
            const currentUser = await dispatch(checkRegistration({
                email: emailValue,
                isRegistered: userRegistered,
            }));
            
            if (currentUser.isRegistered) {
                setUserRegistered(true);
            };
            if (currentUser.username) {
                setUsernameCreated(true)
                setUsernameValue(currentUser.username)
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const onCreateUsername = async () => {
        if (!usernameValue) {
            setInvalidUsername(true);
            return;
        };

        setUsernameCreated(true);
    };

    const onPasswordSubmit = async () => {
        if (!passwordValue) {
            setInvalidPassword(true);
            return;
        }

        try {
            const currentUser = await dispatch(login(emailValue, passwordValue, usernameValue));

            dispatch(setCurrentUser(currentUser));
            currentUser && navigate('/')
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    const onCreatePassword = async () => {
        if (!passwordValue) {
            setInvalidPassword(true);
            return;
        }
        if (!confirmPasswordValue) {
            setInvalidConfirmPassword(true);
            return;
        }
        
        try {
            await dispatch(registerUser(emailValue, passwordValue, usernameValue));
            const currentUser = await dispatch(login(emailValue, passwordValue, usernameValue));
            dispatch(setCurrentUser(currentUser))
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    const handleEmailChange = (e) => {
        setInvalidEmail(false);
        setEmailValue(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setInvalidPassword(false);
        setPasswordValue(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setInvalidUsername(false);
        setUsernameValue(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setInvalidConfirmPassword(false);
        setConfirmPasswordValue(e.target.value);
    };
    
    const handleEmailSubmit = (e) => {
        e.preventDefault(); 
        onEmailSubmit(); 
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault(); 
        onPasswordSubmit(); 
    };

    const handleCreatePassword = (e) => {
        e.preventDefault(); 
        onCreatePassword(); 
    };

    const handleConnectThroughSpotify = async (e) => {
        e.preventDefault();

        const authorizationUrl = `http://localhost:8000/request-authorization/`;

        window.location.href = authorizationUrl;
    };

    return (
        <>
            {!checkedRegistration && !userRegistered ? (
                    <>
                        <Box display='flex' justifyContent='center'>
                            <Box width='100%'>
                                    <form className={classes.form}>
                                        <CardHeader
                                            title='Login/SignUp'
                                            titleTypographyProps={{
                                                width: '100%',
                                                variant: isSmScreen || isXsScreen
                                                ? 'h6'
                                                : 'h5',
                                                textAlign: 'center',
                                                color: 'white',
                                                paddingTop: '1rem'
                                            }}
                                            subheader='Enter an email to get started!'
                                            subheaderTypographyProps={{ 
                                                width: '100%', 
                                                variant: isXlScreen || isLgScreen 
                                                ? 'body1'
                                                : 'body2',
                                                textAlign: 'center',
                                                color: 'whitesmoke',
                                                paddingTop: '5px',
                                            }}
                                        />
                                        <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                                            <TextField 
                                                autoComplete="off"
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
                                                error={errors.email}
                                                required
                                                className={classes.textField}
                                                value={emailValue}
                                                label={errors.email ? "Invalid Email" : "email"}
                                                {...register('email', 
                                                    { 
                                                        required: true, 
                                                        pattern: /^\S+@\S+$/i, 
                                                        onChange: (e) => handleEmailChange(e),
                                                        error: invalidEmail,
                                                    })
                                                }
                                            />
                                        </Box>
                                        <br />
                                        <br />
                                        <Grid className={classes.buttonsContainer}>
                                            <Button
                                                type="submit"
                                                className={classes.button}
                                                onClick={handleSubmit(onEmailSubmit)}
                                            >
                                                Next
                                                <NavigateNextIcon />
                                            </Button>
                                        </Grid>
                                        <br />
                                    </form>
                            </Box>
                        </Box>
                    </>
                    ) : checkedRegistration && userRegistered 
                    ? (
                    <>
                        <Box display='flex' justifyContent='center' paddingTop='3rem'>
                            <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                                    <form className={classes.form} onSubmit={handlePasswordSubmit}>
                                        <CardHeader
                                            title='Welcome Back!'
                                            titleTypographyProps={{
                                                width: '100%',
                                                variant: isSmScreen || isXsScreen
                                                ? 'h6'
                                                : 'h5',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}
                                            subheader={"Enter password to continue to workspace"}
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
                                                error={errors.password}
                                                required
                                                className={classes.textField}
                                                value={passwordValue}
                                                label={errors.password ? "Invalid Password" : "password"}
                                                type="password"
                                                {...register('password', 
                                                    { 
                                                        required: true, 
                                                        onChange: (e) => handlePasswordChange(e),
                                                        error: invalidPassword,
                                                    })
                                                }
                                            />
                                        </Box>
                                        <br />
                                        <br />
                                        <Grid className={classes.buttonsContainer}>
                                            <Button
                                                type="submit"
                                                className={classes.button}
                                                onClick={handleSubmit(onPasswordSubmit)}
                                            >
                                                Login
                                                <NavigateNextIcon />
                                            </Button>
                                        </Grid>
                                        <br />
                                    </form>
                            </Box>
                        </Box>
                    </>     
                ) : !usernameCreated
                ? (
                    <UsernameInput
                        errors={errors}
                        isXlScreen={isXlScreen}
                        isLgScreen={isLgScreen} 
                        isMdScreen={isMdScreen} 
                        isSmScreen={isSmScreen} 
                        isXsScreen={isXsScreen} 
                        classes={classes}
                        usernameValue={usernameValue}
                        register={register}
                        handleUsernameChange={handleUsernameChange}
                        invalidUsername={invalidUsername}
                        handleSubmit={handleSubmit}
                        onCreateUsername={onCreateUsername}
                    />
                ) : user
                ? (
                    <Box display='flex' justifyContent='center' paddingTop='1rem'>
                        <Box width='100%'>
                                <Box className={classes.box}>
                                    <CardHeader
                                        title='Connect to Spotify'
                                        titleTypographyProps={{
                                            width: '100%',
                                            letterSpacing: '1px',
                                            variant: isSmScreen || isXsScreen
                                            ? 'h6'
                                            : 'h5',
                                            textAlign: 'center',
                                            color: 'white',
                                            paddingTop: '1rem'
                                        }}
                                        subheader='Link to your Spotify library to add tracks, create playlists and more!'
                                        subheaderTypographyProps={{ 
                                            width: '100%',
                                            letterSpacing: '1px', 
                                            variant: isXlScreen || isLgScreen 
                                            ? 'body1'
                                            : 'body2',
                                            textAlign: 'center',
                                            alignItems: 'center',
                                            color: 'whitesmoke',
                                        }}
                                    />
                                    <Button
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            '&:hover': {
                                            backgroundColor: 'transparent !important',
                                            },
                                        }}
                                        onClick={handleConnectThroughSpotify}
                                        >
                                        <img
                                            width='150em'
                                            style={{
                                            margin: '0 auto',
                                            display: 'block', 
                                            }}
                                            src={'/static/images/spotifyLogo.png'}
                                        />
                                        </Button>
                                    <br />
                                    <Grid className={classes.buttonsContainer}>
                                        <Button
                                            type="submit"
                                            className={classes.button}
                                            onClick={handleSubmit(onPasswordSubmit)}
                                        >
                                            Skip
                                            <NavigateNextIcon />
                                        </Button>
                                    </Grid>
                                    <br />
                                </Box>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box display='flex' justifyContent='center' paddingTop='1rem'>
                            <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                                    <form className={classes.form} onSubmit={handleCreatePassword}>
                                        <CardHeader
                                            title='Register'
                                            titleTypographyProps={{
                                                width: '100%',
                                                variant: isSmScreen || isXsScreen
                                                ? 'h6'
                                                : 'h5',
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
                                                error={errors.password}
                                                required
                                                className={classes.textField}
                                                value={passwordValue}
                                                label={errors.password ? "Invalid Password" : "password"}
                                                type="password"
                                                {...register('password', 
                                                    { 
                                                        required: true, 
                                                        onChange: (e) => handlePasswordChange(e),
                                                        error: invalidPassword,
                                                    })
                                                }
                                            />
                                        </Box>
                                        <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                                            <TextField 
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
                                                error={errors.reenterPassword}
                                                required
                                                className={classes.textField}
                                                value={confirmPasswordValue}
                                                label={errors.password ? "Invalid Password" : "re-enter password"}
                                                type="password"
                                                {...register('reenterPassword', 
                                                    { 
                                                        required: true, 
                                                        onChange: (e) => handleConfirmPasswordChange(e),
                                                        error: invalidConfirmPassword,
                                                    })
                                                }
                                            />
                                        </Box>
                                        <br />
                                        <br />
                                        <Grid className={classes.buttonsContainer}>
                                            <Button
                                                type="submit"
                                                className={classes.button}
                                                onClick={handleSubmit(onCreatePassword)}
                                            >
                                                Next
                                                <NavigateNextIcon />
                                            </Button>
                                        </Grid>
                                        <br />
                                    </form>
                            </Box>
                        </Box>
                    </>     
                )}
        </>
    )
};

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});

const mapDispatchToProps= (dispatch) => ({
    onConnectThroughSpotify: () => dispatch(getSpotifyUserAuth()),
    onUpdateUsername: (userId, username) => dispatch(handleUpdateUsername(userId, username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
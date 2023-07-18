import { Box, Button, Card, CardHeader, Grid, TextField, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import theme from '../theme'
import { makeStyles } from "@mui/styles";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { checkRegistration, login, registerUser } from "../thunks";
import { setCurrentUser } from "../actions";

const useStyles = makeStyles(() => (
  {
  card: {
    backgroundColor: "white",
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "white",
  },
  textField: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
    backgroundColor: 'white',
    borderRadius: '5px',
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
  noBottomLine: {
    borderBottom: 'none',
  }
}));

export const Login = () => {
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    const classes = useStyles();

    const { handleSubmit, register, formState: { errors }, trigger } = useForm();
    
    const [emailValue, setEmailValue] = useState('');
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [checkedRegistration, setCheckedRegistration] = useState(false);
    const [userRegistered, setUserRegistered] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [usernameCreated, setUsernameCreated] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    const onCreateUsername = async () => {
        setUsernameCreated(true);
        if (!usernameValue) {
            setInvalidUsername(true);
            return;
        }
    }

    const onPasswordSubmit = async () => {
        if (!passwordValue) {
            setInvalidPassword(true);
            return;
        }

        try {
            const currentUser = await dispatch(login(emailValue, passwordValue));
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
            const currentUser = await dispatch(login(emailValue, passwordValue));
            currentUser && navigate('/')
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

    return !checkedRegistration && !userRegistered ? (
        <>
            <Box display='flex' justifyContent='center' paddingTop='3rem'>
                <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                    <Card className={classes.card}>
                        <form className={classes.form} onSubmit={handleEmailSubmit}>
                            <CardHeader
                                title='Login/SignUp'
                                titleTypographyProps={{
                                    width: '100%',
                                    variant: isSmScreen || isXsScreen
                                    ? 'h6'
                                    : 'h5',
                                    textAlign: 'center',
                                    color: 'black',
                                }}
                                subheader='Enter an email to get started!'
                                subheaderTypographyProps={{ 
                                    width: '100%', 
                                    variant: isXlScreen || isLgScreen 
                                    ? 'body1'
                                    : 'body2',
                                    textAlign: 'center',
                                    color: 'black',
                                }}
                            />
                            <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                                <TextField 
                                    autoFocus
                                    variant="outlined"
                                    InputLabelProps={{ style: { margin: '2px 5px' }}}
                                    InputProps={{ disableunderline: 'true', style: { margin: '5px', padding: '5px 0', fill: 'white' }}}
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
                    </Card>
                </Box>
            </Box>
        </>
        ) : checkedRegistration && userRegistered 
        ? (
        <>
            <Box display='flex' justifyContent='center' paddingTop='3rem'>
                <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                    <Card className={classes.card}>
                        <form className={classes.form} onSubmit={handlePasswordSubmit}>
                            <CardHeader
                                title='Welcome Back!'
                                titleTypographyProps={{
                                    width: '100%',
                                    variant: isSmScreen || isXsScreen
                                    ? 'h6'
                                    : 'h5',
                                    textAlign: 'center',
                                    color: 'black',
                                }}
                                subheader={"Enter password to continue to workspace"}
                                subheaderTypographyProps={{ 
                                    width: '100%', 
                                    variant: isXlScreen || isLgScreen 
                                    ? 'body1'
                                    : 'body2',
                                    textAlign: 'center',
                                    color: 'black',
                                    }}
                            />
                            <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                                <TextField 
                                    autoFocus
                                    variant="outlined"
                                    InputLabelProps={{ style: { margin: '2px 5px' }}}
                                    InputProps={{ disableunderline: 'true', style: { margin: '5px', padding: '5px 0', fill: 'white' }}}
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
                    </Card>
                </Box>
            </Box>
        </>     
    ) : !usernameCreated
    ? (
        <>
            <Box display='flex' justifyContent='center' paddingTop='1rem'>
                <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                    <Card className={classes.card}>
                        <form className={classes.form}>
                            <CardHeader
                                title="Looks like you're new here!"
                                titleTypographyProps={{
                                    width: '100%',
                                    variant: isSmScreen || isXsScreen
                                    ? 'h6'
                                    : 'h5',
                                    textAlign: 'center',
                                    color: 'black',
                                }}
                                subheader="Enter a username"
                                subheaderTypographyProps={{ 
                                    width: '100%', 
                                    variant: isXlScreen || isLgScreen 
                                    ? 'body1'
                                    : 'body2',
                                    textAlign: 'center',
                                    color: 'black',
                                }}
                            />
                            <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                                <TextField 
                                    autoFocus
                                    variant="outlined"
                                    InputLabelProps={{ style: { margin: '2px 5px' }}}
                                    InputProps={{ disableunderline: 'true', style: { margin: '5px', padding: '5px 0', fill: 'white' }}}
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
                    </Card>
                </Box>
            </Box>
        </>     
    ) : (
        <>
            <Box display='flex' justifyContent='center' paddingTop='1rem'>
                <Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
                    <Card className={classes.card}>
                        <form className={classes.form} onSubmit={handleCreatePassword}>
                            <CardHeader
                                title='Register'
                                titleTypographyProps={{
                                    width: '100%',
                                    variant: isSmScreen || isXsScreen
                                    ? 'h6'
                                    : 'h5',
                                    textAlign: 'center',
                                    color: 'black',
                                }}
                            />
                            <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                                <TextField 
                                    autoFocus
                                    variant="outlined"
                                    InputLabelProps={{ style: { margin: '2px 5px' }}}
                                    InputProps={{ disableunderline: 'true', style: { margin: '5px', padding: '5px 0', fill: 'white' }}}
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
                                    variant="outlined"
                                    InputLabelProps={{ style: { margin: '2px 5px' }}}
                                    InputProps={{ disableunderline: 'true', style: { margin: '5px', padding: '5px 0', fill: 'white' }}}
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
                    </Card>
                </Box>
            </Box>
        </>     
    )
};

export default connect()(Login);
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
        >
            {/* <Typography
                textAlign='center'
                color='white'
                variant='h3'
            >
                Oops!
            </Typography> */}
            <Typography
                textAlign='center'
                color='white'
                variant='h4'
                letterSpacing='1px'
            >
                Houston, we have a problem...
            </Typography>
            <img
                src={'/static/images/error.gif'}
                alt="Error"
                style={{ 
                    width: '25%',
                    paddingTop: '2%',
                }}
            />
            <Typography
                textAlign='center'
                color='white'
                variant='h5'
                paddingTop='3%'
                width='100%'
                letterSpacing='2px'
            >
                Looks like we ran into an issue with your request. Please try again.
            </Typography>        
            <Typography
                textAlign='center'
                color='white'
                variant='h5'
                width='100%'
                letterSpacing='2px'
            >
                If the issue persists, please contact our support team
            </Typography>
            <Button
                onClick={handleGoBack}
                sx={{
                    width: '15%',
                    marginTop: '2%',
                    color: 'white',
                    backgroundColor: 'rgb(44, 216, 207, 0.3)',
                    border: '2px solid rgba(89, 149, 192, 0.5)',
                    borderRadius: '18px',
                    boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
                    transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
                    '&:hover, &:active, &.MuiFocusVisible': {
                        border: '2px solid rgba(89, 149, 192, 0.5)',
                        backgroundColor: 'rgb(44, 216, 207, 0.5)',
                        boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
                    },
                }}
            >
                <Typography
                  variant='body2' 
                  color='white'
                  letterSpacing='1px'
                  sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                    Relaunch
                </Typography>
            </Button>        
        </Box>
    )
};

export default ErrorPage;
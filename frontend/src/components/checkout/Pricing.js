import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { confirmSpotifyAccess } from "actions";
import getCSRFToken from "csrf";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "theme";
import { getPricing } from "thunks";

const useStyles = makeStyles((theme) => ({
  containerBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: '600px',
  },
  button: {
    color: 'white',
    backgroundColor: `rgb(121, 44, 216, 0.3)`,
    border: `2px solid ${theme.palette.primary.triadic1}`,
    borderRadius: '8px',
    boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
    width: 'fit-content',
    padding: '2% 5%',
    transition: 'border 0.3s, background 0.3s, boxShadow 0.3s width 0.3s',
    '&:hover, &:active, &.MuiFocusVisible': {
      border: `2px solid ${theme.palette.primary.triadic1}`,
      background: `rgb(121, 44, 216, 0.5)`,
      boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
    },
  },
  focusedCard: {
    display: 'flex',
    width: '25vw',
    height: '75vh',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: '1%',
    borderRadius: '8px',
    backgroundColor: '#282828',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
    opacity: '0.8',
    transition: 'width 0.3s, height 0.3s',
  },
  unfocusedCard: {
    display: 'flex',
    width: '20vw',
    height: '65vh',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: '1%',
    borderRadius: '8px',
    backgroundColor: '#282828',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
    opacity: '0.8',
    transition: 'width 0.3s, height 0.3s',
  },
  unfocusedTitleTypography: {
    color: 'white',
    letterSpacing: '2px',
    paddingBottom: '5%',
    height: 'auto',
    fontSize: '1.5rem', 
    transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out', 
  },
  unfocusedPriceTypography: {
    color: '#2c8bd8',
    letterSpacing: '2px',
    height: 'auto',
    fontSize: '2rem',
    transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
  },
  unfocusedDetailTypography: {
    color: 'white',
    letterSpacing: '2px',
    height: 'auto',
    fontSize: '1rem',
    transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
  },
  focusedTitleTypography: {
    color: '#d82c8b',
    letterSpacing: '2px',
    paddingBottom: '5%',
    height: 'auto',
    fontSize: '2rem',
    transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
  },
  focusedPriceTypography: {
    color: '#d82c8b',
    letterSpacing: '2px',
    height: 'auto',
    fontSize: '3rem',
    transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
  },
  focusedDetailTypography: {
    color: 'white',
    letterSpacing: '2px',
    height: 'auto',
    fontSize: '1.5rem',
    transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
}));

export const Pricing = ({ onGetPricing, user }) => {
  const classes = useStyles(theme);
  const [focusedIndex, setFocusedIndex] = useState(1);
  const [pricing, setPricing] = useState(null);

  const navigate = useNavigate();

  const handleCardFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleCardBlur = () => {
    setFocusedIndex(1);
  };

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const newPricing = await onGetPricing();
        setPricing(newPricing);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    };

    fetchPricing();
  }, [onGetPricing]);

  const handleSelectPricing = (price) => {
    console.log(price);
    navigate('/checkout', { state: { selectedPrice: price } });
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
      const newSearchParams = new URLSearchParams(searchParams);

      async function fetchData() {
        const authorizationCode = newSearchParams.get('code');
        const authorizationState = newSearchParams.get('state')
        
          if (authorizationCode) {
            newSearchParams.delete('code');
            newSearchParams.delete('state');
            const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
            window.history.replaceState({}, document.title, newURL);
            try {
                const csrftoken = await getCSRFToken();

                const response = await fetch('http://localhost:8000/auth/spotify/callback/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                        // 'Authorization': `Bearer ${user.access}`
                    },
                    body: JSON.stringify({ code: authorizationCode, userId: user.user.id }),
                });

                const data = await response.json();

                const spotifyConnected = data['spotify_connected']

                if (spotifyConnected) {
                  dispatch(confirmSpotifyAccess(spotifyConnected))
                }

                const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
                window.history.replaceState({}, document.title, newURL);
            } catch (error) {
                console.error('Error:', error);
                // Handle any errors
            }
        };
      };

      // Call the async function
      fetchData();
    }, []);

    const dispatch = useDispatch();

    return (
      <>
        <Typography 
          textAlign='center'
          variant="h4"
          color='whitesmoke'
          letterSpacing='1px'
        >
          Use Tokens To Uncover Hidden Gems and More
        </Typography>
        <Box className={classes.containerBox}>
          {pricing && Object.values(pricing).map((price, outerIndex) => (
          <Card
              key={outerIndex}
              className={outerIndex === focusedIndex ? classes.focusedCard : classes.unfocusedCard}
              onMouseOver={() => handleCardFocus(outerIndex)}
              onMouseOut={handleCardBlur}
              onFocus={() => handleCardFocus(outerIndex)}
              onBlur={handleCardBlur}
              tabIndex={0}
          >
            <Box 
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              height='80%'
              justifyContent='space-around'
            >
              {price.name === '20 Tokens' && (
                <Typography color='white' variant='subtitle2'>* Best Value</Typography>
              )}
              <Typography
                  className={outerIndex === focusedIndex ? classes.focusedTitleTypography : classes.unfocusedTitleTypography}
              >
                  {price.name.toUpperCase()}
              </Typography>
              {price.name === '20 Tokens' ? (
                <img 
                  src={'/static/images/twentyTokens.png'} 
                  style={{
                    width: '20em'
                  }}
                />
              ) : price.name === '10 Tokens' ? (
                <img 
                  src={'/static/images/tenTokens.png'}
                  style={{
                    width: '10em'
                  }} 
                />
              ) : (
                <img 
                  src={'/static/images/threeTokens.png'}
                  style={{
                    width: '10em'
                  }} 
                />
              )}
              <Typography
                  className={outerIndex === focusedIndex ? classes.focusedPriceTypography : classes.unfocusedPriceTypography}
              >
                  {`$${price.price / 100}`}
              </Typography>
              {/* <Box className={classes.detailBox}>
                  <ul>
                  {price.details.map((detail, innerIndex) => (
                      <li key={innerIndex}>
                      <Typography
                          className={
                          outerIndex === focusedIndex
                              ? classes.focusedDetailTypography
                              : classes.unfocusedDetailTypography
                          }
                      >
                          {detail}
                      </Typography>
                      </li>
                  ))}
                  </ul>
              </Box> */}
              {outerIndex === focusedIndex && (
                <Button 
                  className={classes.button} 
                  variant='contained'
                  onClick={() => handleSelectPricing(price)}
                >
                  {
                    price.name === '20 Tokens' ? 'Get 1/2 Off' :
                    price.name === '10 Tokens' ? 'Get 30% Savings' :
                    'Buy'
                  }
                </Button>
              )}
            </Box>
          </Card>
          ))}
        </Box>
      </>
    );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGetPricing: () => dispatch(getPricing()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);

import {PaymentElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";
import { useEffect, useState } from 'react';
import getCSRFToken from '../../csrf';
import { makeStyles } from '@mui/styles';
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material';
import { connect } from 'react-redux';
import 'App.css';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    stripeForm: {
        margin: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        border: '2px solid rgba(89, 149, 192, 0.5)',
        borderRadius: '18px',
        background: 'rgba(48, 130, 164, 0.15)',
        boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
    },
    inputLabel: {
        overflow: 'hidden',   
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        margin: '10px', 
        background: 'white',
        height: '50px'
    },
    button: {
      color: 'white',
      backgroundColor: 'rgb(44, 216, 207, 0.3)',
      border: '2px solid rgba(89, 149, 192, 0.5)',
      borderRadius: '8px',
      boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
      transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
      '&:hover, &:active, &.MuiFocusVisible': {
        border: '2px solid rgba(89, 149, 192, 0.5)',
        backgroundColor: 'rgb(44, 216, 207, 0.5)',
        boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
      },
    },
}))

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutForm = ({ clientSecret, selectedPrice, user }) => {
    const classes = useStyles();

    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        };

        if (!clientSecret) {
            return;
        };

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            };
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        };

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/payment-complete',
            },
        });

        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        };

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: 'tabs',
        business: {
            name: 'SongQuest',
        }
    };

    return (
        <Box display='flex' justifyContent='center'>
            <form className={classes.stripeForm} onSubmit={handleSubmit}>
                <PaymentElement id='payment-element' options={paymentElementOptions} />
                <Button 
                    disabled={isLoading || !stripe || !elements}  
                    type='submit'
                    variant='contained'
                    className={classes.button}
                >
                    <span>
                        {isLoading ? <div className='spinner' id='spinner'></div> : `Pay $${selectedPrice.price/100}`}
                    </span>
                </Button>
                {message && (
                    <Box display='flex' justifyContent='center'>
                        <Typography color='error' id='payment-message'>
                            {message}
                        </Typography>
                    </Box>
                )}
            </form>
        </Box>
    );
};

export const StripeCheckout = ({user}) => {
    const [clientSecret, setClientSecret] = useState('');
    const location = useLocation();
    console.log(location)

    const selectedPrice = location.state?.selectedPrice;
    console.log(selectedPrice)

    useEffect(() => {
        const fetchData = async () => {
            const csrfToken = await getCSRFToken();

            const body = JSON.stringify(selectedPrice)

            const response = await fetch('http://localhost:8000/create-payment-intent/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                 },
                body: body,
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }
            
            const data = await response.json();

            setClientSecret(data.clientSecret);
        };

        fetchData();
    }, []);

    const appearance = {
        theme: 'night',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return clientSecret && (
        <Elements options={options} stripe={stripePromise}>
            <CheckoutForm 
                user={user} 
                clientSecret={clientSecret} 
                selectedPrice={selectedPrice}
            />
        </Elements>
    );
};

const mapStateToProps = (state) => {
  return {
    user: state.user?.currentUser?.user,
  };
};

export default connect(mapStateToProps)(StripeCheckout);
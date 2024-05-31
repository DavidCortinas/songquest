import React from 'react';
import { PaymentElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useEffect, useState } from 'react';
import getCSRFToken from '../../csrf';
import { makeStyles } from '@mui/styles';
import { Box, Button, Typography } from '@mui/material';
import { connect } from 'react-redux';
import '../../App.css';
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
		boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
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
			boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
		}
	}
}));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

// eslint-disable-next-line no-unused-vars
const CheckoutForm = ({ clientSecret, selectedPrice }) => {
	const classes = useStyles();

	const stripe = useStripe();
	const elements = useElements();

	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async event => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: 'http://localhost:3000/?payment=success'
			}
		});

		// Handle errors from Stripe
		if (error) {
			setMessage(error.message);
		}

		setIsLoading(false);
	};

	return (
		<Box display='flex' justifyContent='center'>
			<form className={classes.stripeForm} onSubmit={handleSubmit}>
				<PaymentElement id='payment-element' />
				<Button
					disabled={isLoading || !stripe || !elements}
					type='submit'
					variant='contained'
					color='primary'
					className={classes.button}
				>
					{isLoading ? 'Processing…' : `Pay $${(selectedPrice.price / 100).toFixed(2)}`}
				</Button>
				{message && (
					<Box marginTop={2}>
						<Typography color='error'>{message}</Typography>
					</Box>
				)}
			</form>
		</Box>
	);
};

export const StripeCheckout = ({ user }) => {
	const [clientSecret, setClientSecret] = useState('');
	const location = useLocation();

	const selectedPrice = location.state?.selectedPrice;

	useEffect(() => {
		const fetchData = async () => {
			const csrfToken = await getCSRFToken();

			const body = JSON.stringify(selectedPrice);

			const response = await fetch('/create-payment-intent/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'User-Id': user?.id
				},
				body: body
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
		theme: 'night'
	};

	const options = {
		clientSecret,
		appearance
	};

	return (
		clientSecret && (
			<Elements options={options} stripe={stripePromise}>
				<CheckoutForm
					user={user}
					clientSecret={clientSecret}
					selectedPrice={selectedPrice}
				/>
			</Elements>
		)
	);
};

const mapStateToProps = state => {
	return {
		user: state.user?.currentUser?.user
	};
};

export default connect(mapStateToProps)(StripeCheckout);

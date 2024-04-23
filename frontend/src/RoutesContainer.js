import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import { BottomContainer } from './components/BottomContainer';
import ProtectedRoute from './ProtectedRoute';
import { LoadingState } from './components/LoadingState';

// Lazy loaded components
const Login = lazy(() => import('./components/auth/Login'));
const ErrorPage = lazy(() => import('./components/ErrorPage'));
const SongDiscovery = lazy(() => import('./components/SongDiscovery'));
const SpotifyConnect = lazy(() => import('./components/SpotifyConnect'));
const StripeCheckout = lazy(() => import('./components/checkout/StripeCheckout'));
const Pricing = lazy(() => import('./components/checkout/Pricing'));
const RegistrationSuccess = lazy(() => import('./components/auth/RegistrationSuccess'));
const Onboard = lazy(() => import('./components/auth/Onboard'));
const Profile = lazy(() => import('./components/auth/Profile'));
const VerificationError = lazy(() => import('./components/VerificationError'));
const CleanUrlAndHandlePaymentSuccess = lazy(() =>
	import('./components/checkout/utilities/CleanUrlAndHandlePaymentSuccess')
);

const RoutesContainer = () => {
	return (
		<Box>
			<TopBar collapse={true} />
			<Suspense fallback={<LoadingState />}>
				<Routes>
					<Route
						path={'/'}
						element={
							<CleanUrlAndHandlePaymentSuccess>
								<SongDiscovery />
							</CleanUrlAndHandlePaymentSuccess>
						}
					/>
					<Route path={'/login'} element={<Login />} />
					<Route path={'/error'} element={<ErrorPage />} />
					<Route element={<ProtectedRoute />}>
						<Route path={'/registration-success'} element={<RegistrationSuccess />} />
						<Route path={'/onboard'} element={<Onboard />} />
						<Route path={'/verification-error'} element={<VerificationError />} />
						<Route path={'/profile'} element={<Profile />} />
						<Route path={'/spotify-connect'} element={<SpotifyConnect />} />
						<Route path={'/pricing'} element={<Pricing />} />
						<Route path={'/checkout'} element={<StripeCheckout />} />
					</Route>
				</Routes>
			</Suspense>
			<BottomContainer />
		</Box>
	);
};

export default RoutesContainer;

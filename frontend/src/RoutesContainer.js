import React, { Suspense, lazy } from 'react';
import Login from './components/auth/Login';
import { Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Box } from '@mui/material';
import { BottomContainer } from './components/BottomContainer';
import SpotifyConnect from './components/SpotifyConnect';
import StripeCheckout from './components/checkout/StripeCheckout';
import ProtectedRoute from './ProtectedRoute';
import Pricing from './components/checkout/Pricing';
import RegistrationSuccess from './components/auth/RegistrationSuccess';
import ErrorPage from './components/ErrorPage';
import CleanUrlAndHandlePaymentSuccess from './components/checkout/utilities/CleanUrlAndHandlePaymentSuccess';
import Onboard from './components/auth/Onboard';
import Profile from './components/auth/Profile';
import { VerificationError } from './components/VerificationError';
import { LoadingState } from './components/LoadingState';

const SongDiscovery = lazy(() => import('./components/SongDiscovery'));

const RoutesContainer = () => {

	return (
		<Box>
			<TopBar collapse={true}/>
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
					<Route 
						path={'/login'}
						element={
							<Login />
						}
					/>
					<Route 
						path={'/error'}
						element={
							<ErrorPage />
						}
					/>
					<Route element={<ProtectedRoute />}>
						<Route 
							path={'/registration-success'} 
							element={<RegistrationSuccess />} 
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route 
							path={'/onboard'} 
							element={<Onboard />} 
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route 
							path={'/verification-error'} 
							element={<VerificationError />} 
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route 
							path={'/profile'} 
							element={<Profile />} 
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route 
							path={'/spotify-connect'} 
							element={<SpotifyConnect />} 
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route 
							path={'/pricing'} 
							element={<Pricing />} 
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route 
							path={'/checkout'} 
							element={<StripeCheckout />} 
						/>
					</Route>
				</Routes>
			</Suspense>
			<BottomContainer />
		</Box>
	);
};

export default RoutesContainer

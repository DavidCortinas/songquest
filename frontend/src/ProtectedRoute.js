import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
	const user = useSelector(state => state.user.currentUser);

	if (Object.keys(user).length === 0) {
		return <Navigate to='/login' />;
	}

	return <Outlet />;
};

export default ProtectedRoute;

import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RouteGuard({ token, routeRedirect }) {
    const location = useLocation();
    return localStorage.getItem(token) ? (
        <Outlet />
    ) : (
        <Navigate to={routeRedirect} replace state={{ from: location }} />
    );
}

export default RouteGuard
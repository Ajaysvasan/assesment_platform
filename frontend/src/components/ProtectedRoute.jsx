import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, hasRole } from "../lib/auth";

export const ProtectedRoute = ({ allowedRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && !hasRole(allowedRole)) {
    // If they are logged in but don't have the right role, send to an unauthorized page or default dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

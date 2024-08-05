import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = () => {
    const user = sessionStorage.getItem("user");
    return user !== null;
  };

  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/AuthProvider"; // Assuming this hook gives user context

// const PrivateRoute = () => {
//   const { token } = useAuth(); // Get the token from the context

//   if (!token) {
//     return <Navigate to="/login_page" />; // Redirect to login if no token found
//   }

//   return <Outlet />; // Allow access to child routes if authenticated
// };

// export default PrivateRoute;

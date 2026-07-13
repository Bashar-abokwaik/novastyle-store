import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import type { RootState } from "../app/store";
import { userService } from "../services/userService";
import type { User } from "../types";

import Spinner from "../components/UI/Spinner/Spinner";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

// AdminRoute component ensures that only authenticated users with the "admin" role can access certain routes.
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  // Get the authentication token from the Redux store
  const token = useSelector((state: RootState) => state.auth.token);

  // Use React Query to fetch the current user's profile and check their role
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = (await userService.getUserProfile()) as { user: User };
      return response.user;
    },
    enabled: !!token,
  });

  // If there is no authentication token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the user data is still loading, show a spinner
  if (isLoading) {
    return <Spinner />;
  }

  // If the user is not an admin, redirect to the home page
  if (data?.role !== "admin") {
    return <Navigate to="/" />;
  }

  // If there is an error fetching the user data, show an error page
  if (isError) {
    return <ErrorPage />;
  }

  return children;
};

export default AdminRoute;

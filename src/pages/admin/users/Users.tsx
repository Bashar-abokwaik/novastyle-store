import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React from "react";
import { userService } from "../../../services/userService";
import type { RootState } from "../../../app/store";
import type { User } from "../../../types";
import Spinner from "../../../components/UI/Spinner/Spinner";
import styles from "./users.module.css";

export default function Users(): React.JSX.Element {
  // Get the authentication token from the Redux store to determine if the user is logged in.
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  // Use React Query to fetch all users from the server. The query is enabled only if the user is authenticated (i.e., a valid token exists).
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      return (response as { users: User[] }).users;
    },
    enabled: !!token,
  });
  // Function to handle navigation to the user details page when the "View Details" button is clicked. It takes the userId as a parameter and navigates to the corresponding user details route.
  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };
  // If the users data is still loading, show a spinner to indicate loading state. If there is an error fetching the users data, display an error message. Otherwise, render the users management table with user details and actions.
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <p className={styles.error}>Error: {error.message}</p>;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Users Management</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`${styles.role} ${
                      user.role === "admin" ? styles.admin : styles.user
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  {user.address
                    ? `${user.address.street}, ${user.address.city}`
                    : "N/A"}
                </td>

                <td>
                  {user.role !== "admin" && (
                    <button
                      className={styles.actionButton}
                      onClick={() => handleViewUser(user._id)}
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

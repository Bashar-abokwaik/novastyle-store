import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { userService } from "../../../services/userService";
import type { RootState } from "../../../app/store";
import type { User } from "../../../types";
import Spinner from "../../../components/UI/Spinner/Spinner";
import styles from "./users.module.css";

export default function UserInfo(): React.JSX.Element {
  // Get the authentication token from the Redux store to determine if the user is logged in.
  const token = useSelector((state: RootState) => state.auth.token);
  // Get the userId from the URL parameters to fetch the specific user's details.
  const { userId } = useParams<{ userId: string }>();
  // Use React Query to fetch the specific user's details based on the userId from the URL parameters. The query is enabled only if the user is authenticated (i.e., a valid token exists) and a userId is provided.
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await userService.getUserById(userId!);
      return (response as { user: User }).user;
    },
    enabled: !!token && !!userId,
  });
  // If the user data is still loading, show a spinner to indicate loading state. If there is an error fetching the user data, display an error message. If no user is found, display a "User not found" message. Otherwise, render the user's details in a structured format.
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <p className={styles.error}>Error: {error.message}</p>;
  }
  if (!user) {
    return <p className={styles.error}>User not found</p>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>User Details</h1>

        <div className={styles.infoRow}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{user.name}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{user.email}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Role</span>
          <span className={styles.value}>{user.role}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Address</span>
          <span className={styles.value}>
            {user.address
              ? `${user.address.street}, ${user.address.city}, ${user.address.country}, ${user.address.postalCode}`
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

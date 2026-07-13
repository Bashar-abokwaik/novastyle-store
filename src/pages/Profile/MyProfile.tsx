import ChangePassword from "../../components/Profile/ChangePassword";
import ProfileActions from "../../components/Profile/ProfileActions";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import styles from "./myProfile.module.css";

// MyProfile component serves as the main profile page for users, allowing them to view and manage their personal information, change their password, and access various profile-related actions.
export default function MyProfile() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>My Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>
        <ProfileInfo />
        <ChangePassword />
        <ProfileActions />
      </div>
    </section>
  );
}

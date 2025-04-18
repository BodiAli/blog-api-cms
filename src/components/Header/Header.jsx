import logBlogIcon from "/images/the-log-blog-icon.svg";
import { useUser } from "../../utils/UserContext";
import { NavLink } from "react-router";
import styles from "./Header.module.css";

export default function Header() {
  const user = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.websiteLogo}>
        <img src={logBlogIcon} alt="The Log Blog icon" />
        <span>The Log Blog</span>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/">Manage posts</NavLink>
        <NavLink to="create-post">Create post</NavLink>
        <a href="#">Public</a>
      </nav>
      <div className={styles.profile}>
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
        <img src={user.Profile.profileImgUrl} alt="User profile picture" />
      </div>
    </header>
  );
}

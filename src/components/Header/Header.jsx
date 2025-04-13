import logBlogIcon from "/images/the-log-blog-icon.svg";
import { useUser } from "../../utils/UserContext";
import { NavLink } from "react-router";
import styles from "./Header.module.css";

export default function Header() {
  const { user } = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.websiteLogo}>
        <img src={logBlogIcon} alt="The Log Blog icon" />
        <h1>The Log Blog</h1>
      </div>
      <nav>
        <NavLink to="posts">Manage posts</NavLink>
        <NavLink to="create-post">Create post</NavLink>
        <a href="#">Public</a>
      </nav>
      <div className={styles.profile}>
        <img src={user.Profile.profileImgUrl} alt="User profile picture" />
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
      </div>
    </header>
  );
}

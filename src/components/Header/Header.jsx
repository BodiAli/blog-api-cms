import logBlogIcon from "/images/the-log-blog-icon.svg";
import { useUser } from "../../utils/UserContext";
import { NavLink, useNavigate } from "react-router";
import anonymousImage from "../../assets/images/anonymous.jpg";
import styles from "./Header.module.css";

export default function Header() {
  const user = useUser();
  const navigate = useNavigate();

  function handleUserLogout() {
    localStorage.removeItem("token");
    navigate("/log-in", { replace: true });
  }

  return (
    <header className={styles.header}>
      <div className={styles.websiteLogo}>
        <img src={logBlogIcon} alt="The Log Blog icon" />
        <span>The Log Blog</span>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/" viewTransition>
          Manage posts
        </NavLink>
        <NavLink to="create-post" viewTransition>
          Create post
        </NavLink>
        <a href={import.meta.env.VITE_PUBLIC_URL}>Public</a>
      </nav>
      <div className={styles.profile}>
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
        <img
          src={user.Profile.profileImgUrl ? user.Profile.profileImgUrl : anonymousImage}
          alt="User profile picture"
        />
        <button onClick={handleUserLogout}>Logout</button>
      </div>
    </header>
  );
}

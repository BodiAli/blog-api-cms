import logBlogIcon from "/images/the-log-blog-icon.svg";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Form from "../../components/Form/Form.jsx";
import FormButton from "../../components/FormButton/FormButton.jsx";
import { useIsUserLoggedIn } from "../../utils/UserContext.jsx";
import styles from "./Login.module.css";
import Loader from "../../components/Loader/Loader.jsx";

export default function Login() {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [isSignedIn, loading] = useIsUserLoggedIn();

  async function handleUserLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/log-in`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const { errors: badRequestErrors } = await res.json();
          setErrors(badRequestErrors);
          return;
        }

        if (res.status === 401) {
          const { error: unauthorizedError } = await res.json();
          setErrors([{ msg: unauthorizedError }]);
          return;
        }
        throw new Error("Failed to log in please try again later");
      }

      const { token } = await res.json();

      localStorage.setItem("token", token);

      navigate("/");
    } catch {
      toast.error("Failed to log in please try again later");
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      toast.info("You are already signed in.");
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  if (loading) return <Loader />;

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.websiteHeader}>
          <img src={logBlogIcon} alt="The Log Blog icon" />
          <h1>The Log Blog</h1>
        </div>
        <div className={styles.loginHeader}>
          <h2>Log in to your account</h2>
        </div>
      </div>
      <Form onSubmit={handleUserLogin}>
        <ul className={styles.errors}>
          {errors.map((error, i) => {
            return <li key={i}>{error.msg}</li>;
          })}
        </ul>
        <div className={styles.formContent}>
          <label>
            Email
            <input type="email" name="email" placeholder="name@email.com" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Password" required />
          </label>
          <FormButton>Log in</FormButton>
          <p>
            Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
          </p>
        </div>
      </Form>
    </main>
  );
}

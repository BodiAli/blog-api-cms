import logBlogIcon from "/images/the-log-blog-icon.svg";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useState } from "react";
import Form from "../../components/Form/Form.jsx";
import FormButton from "../../components/FormButton/FormButton.jsx";
import styles from "./Signup.module.css";

// TODO: Implement preview selected image

export default function Signup() {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  async function handleUserSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/sign-up`, {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 400) {
          const { errors: badRequestErrors } = await res.json();
          setErrors(badRequestErrors);
          return;
        }

        throw new Error("Failed to sign up please try again later");
      }

      const { token } = await res.json();

      localStorage.setItem("token", token);

      navigate("/");
    } catch {
      toast.error("Failed to sign up please try again later");
    }
  }

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.websiteHeader}>
          <img src={logBlogIcon} alt="The Log Blog icon" />
          <h1>The Log Blog</h1>
        </div>
        <div className={styles.signupHeader}>
          <h2>Create a new account</h2>
        </div>
      </div>
      <Form onSubmit={handleUserSignup}>
        <ul className={styles.errors}>
          {errors.map((error, i) => {
            return <li key={i}>{error.msg}</li>;
          })}
        </ul>
        <div className={styles.formContent}>
          <label>
            First name
            <input type="text" name="firstName" placeholder="First name" required />
          </label>
          <label>
            Last name
            <input type="text" name="lastName" placeholder="Last name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="name@email.com" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Password" required />
          </label>
          <label>
            Confirm password
            <input type="password" name="confirmPassword" placeholder="Confirm password" required />
          </label>
          <label>
            Profile picture (optional -- max size 3MB)
            <input type="file" name="userImage" accept="image/*" />
          </label>
          <FormButton>Sign up</FormButton>
          <p>
            Already have an account? <Link to="/log-in">Log in</Link>
          </p>
        </div>
      </Form>
    </main>
  );
}

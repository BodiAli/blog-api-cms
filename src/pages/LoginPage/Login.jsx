import { useEffect } from "react";
import { useLocation } from "react-router";
import Form from "../../components/Form/Form.jsx";

export default function Login() {
  const location = useLocation();

  const flashMessage = location.state;

  async function handleUserLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/log-in`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const { token } = await res.json();

    localStorage.setItem("token", token);
  }

  // Clear the flash message from history after displaying it
  useEffect(() => {
    if (flashMessage) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [flashMessage]);

  return (
    <Form onSubmit={handleUserLogin}>
      {flashMessage && <p>{flashMessage}</p>}
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Password
        <input type="text" name="password" />
      </label>
      <button type="submit">Submit</button>
    </Form>
  );
}

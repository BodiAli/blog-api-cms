export default function Login() {
  return (
    <form
      onSubmit={async (e) => {
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
      }}
    >
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Password
        <input type="text" name="password" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

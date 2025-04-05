import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../utils/UserContext";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = jwtDecode(token);

    const userId = decoded.sub;

    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("You need to sign in or sign up before continuing.");
            return;
          }
          throw new Error("Failed to fetch user");
        }

        const { user: fetchedUser } = await res.json();

        setUser(fetchedUser);
      } catch (error) {
        setUser(null);
        setError(error.message || "Error fetching user");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  console.log(user);

  if (loading) return <p>Loading...</p>;

  if (error || !token || !user) {
    return <Navigate to="log-in" replace={true} state={error} />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

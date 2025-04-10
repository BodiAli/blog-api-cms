import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../utils/UserContext";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("You need to sign in or sign up before continuing.");
      setLoading(false);
      setRedirect(true);
      return;
    }

    const userId = getUserIdFromToken(token);

    if (!userId) {
      toast.error("Invalid token.");
      setLoading(false);
      setRedirect(true);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("You need to sign in or sign up before continuing.");
            setRedirect(true);
            return;
          }
          throw new Error("Failed to fetch user");
        }

        const { user: fetchedUser } = await res.json();

        setUser(fetchedUser);
      } catch (error) {
        toast.error(error.message || "Error fetching user");
        setUser(null);
        setRedirect(true);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  console.log(user);

  if (loading) return <p>Loading...</p>;

  if (redirect || !token || !user) {
    return <Navigate to="log-in" replace={true} />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

function getUserIdFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch {
    return null;
  }
}

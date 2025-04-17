import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { UserContext } from "../utils/UserContext";
import Loader from "../components/Loader/Loader";

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

    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/validate`, {
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

        const fetchedUser = await res.json();

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

  if (loading) return <Loader />;
  console.log("USER", user);

  if (redirect) {
    return <Navigate to="log-in" replace={true} />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export function useIsUserLoggedIn() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/validate`, {
          headers: {
            Authorization: token,
          },
        });

        if (res.ok) {
          setSignedIn(true);
          return;
        }
      } catch (error) {
        console.error(error.message);
        return;
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return [signedIn, loading];
}

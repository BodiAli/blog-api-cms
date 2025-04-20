import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import styles from "./UserPosts.module.css";

export default function UserPosts() {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserPosts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/posts`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user posts");
        }

        const { posts: fetchedPosts } = await res.json();
        setPosts(fetchedPosts);
        console.log(fetchedPosts);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPosts();
  }, []);

  if (error) throw new Error(error);

  if (loading) return <Loader />;

  return (
    <main>
      <p>koko</p>
    </main>
  );
}

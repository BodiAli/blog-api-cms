import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { useUser } from "../../utils/UserContext";
import Card from "../Card/Card";
import styles from "./UserPosts.module.css";

export default function UserPosts() {
  const user = useUser();
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryString = new URLSearchParams(window.location.search);
    const page = queryString.get("page");

    async function fetchUserPosts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/posts?page=${page}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user posts");
        }

        const { posts: fetchedPosts } = await res.json();
        setPosts(fetchedPosts);
        // console.log(fetchedPosts);
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
    <main className={styles.main}>
      <h1>
        {user.firstName} {user.lastName}&apos;s posts
      </h1>
      <hr />
      <div className={styles.postsContainer}>
        {posts.length === 0 ? (
          <p className={styles.noPosts}>You have no posts yet</p>
        ) : (
          posts.map((post, i) => {
            return <Card key={i} post={post} />;
          })
        )}
      </div>
    </main>
  );
}

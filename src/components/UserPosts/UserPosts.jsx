import { useEffect, useState } from "react";

export default function UserPosts() {
  const [posts, setPosts] = useState(null);
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
        setPosts(fetchedPosts[0]);
        console.log(fetchedPosts[0]);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserPosts();
  }, []);

  return (
    <main>
      <p>koko</p>
    </main>
  );
}

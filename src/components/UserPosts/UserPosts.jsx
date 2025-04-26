import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { useUser } from "../../utils/UserContext";
import Card from "../Card/Card";
import styles from "./UserPosts.module.css";

export default function UserPosts() {
  const user = useUser();
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const dialogRef = useRef(null);

  function handlePublishPost(updatedPost) {
    setPosts(
      posts.map((post) => {
        return post.id === updatedPost.id ? updatedPost : post;
      })
    );
  }

  function showModal(post) {
    return () => {
      setSelectedPost(post);
      dialogRef.current.showModal();
    };
  }

  function closeModal() {
    setSelectedPost(null);
    dialogRef.current.close();
  }

  async function fetchUserPosts() {
    const queryString = new URLSearchParams(window.location.search);
    const page = queryString.get("page");
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
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostDelete() {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${selectedPost.id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user posts");
      }

      await fetchUserPosts();

      closeModal();
      toast.success("Post deleted!");
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      fetchUserPosts();
    }

    return () => {
      ignore = true;
    };
  }, []);

  if (error) throw new Error(error);

  if (loading) return <Loader />;

  return (
    <main className={styles.main}>
      <dialog className={styles.dialog} ref={dialogRef}>
        <div className={styles.dialogContent}>
          <p>
            Are you sure you want to delete <strong>{selectedPost?.title}</strong>?
          </p>
          <div>
            <button onClick={closeModal}>Cancel</button>
            <button onClick={handlePostDelete}>Delete</button>
          </div>
        </div>
      </dialog>
      <h1>
        {user.firstName} {user.lastName}&apos;s posts
      </h1>
      <hr />
      <div className={styles.postsContainer}>
        {posts.length === 0 ? (
          <p className={styles.noPosts}>You have no posts yet</p>
        ) : (
          posts.map((post, i) => {
            return <Card key={i} post={post} onUpdate={handlePublishPost} requestPostDelete={showModal} />;
          })
        )}
      </div>
    </main>
  );
}

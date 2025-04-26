import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { useUser } from "../../utils/UserContext";
import Card from "../Card/Card";
import styles from "./UserPosts.module.css";

export default function UserPosts() {
  const user = useUser();
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const dialogRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryString = new URLSearchParams(location.search);
  const currentPage = Number.parseInt(queryString.get("page"), 10) || 1;

  const fetchUserPosts = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/posts?page=${page}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user posts");
      }

      const { posts: fetchedPosts, pages } = await res.json();

      setPosts(fetchedPosts);
      setTotalPages(pages);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

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

      closeModal();

      // do not await fetchUserPosts to call toast.success immediately after deleting post successfully
      fetchUserPosts(currentPage);

      toast.success("Post deleted!");
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      fetchUserPosts(currentPage);
    }

    return () => {
      ignore = true;
    };
  }, [fetchUserPosts, currentPage]);

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
      <div className={styles.pagination}>
        <button
          className={currentPage <= 1 ? styles.disabled : ""}
          disabled={currentPage <= 1}
          onClick={() => {
            navigate(`?page=${currentPage - 1}`, { viewTransition: true });
          }}
        >
          Back
        </button>
        {Array.from({ length: totalPages }, (_val, i) => i + 1).map((pageNumber) => {
          return (
            <button
              onClick={() => {
                navigate(`?page=${pageNumber}`, { viewTransition: true });
              }}
              key={pageNumber}
              className={currentPage === pageNumber ? styles.active : ""}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className={currentPage >= totalPages ? styles.disabled : ""}
          disabled={currentPage >= totalPages}
          onClick={() => {
            navigate(`?page=${currentPage + 1}`, { viewTransition: true });
          }}
        >
          Next
        </button>
      </div>
    </main>
  );
}

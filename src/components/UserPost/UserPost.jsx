import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import Loader from "../Loader/Loader";
import CommentCard from "../CommentCard/CommentCard";
import noImage from "../../assets/images/no-image.svg";
import styles from "./UserPost.module.css";

export default function UserPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function handleDeleteComment(comment) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts/${comment.postId}/comments/${comment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete comment please try again later");
      }

      toast.success("Comment deleted successfully!");
      setPost({
        ...post,
        Comments: post.Comments.filter((commentValue) => {
          return commentValue.id !== comment.id;
        }),
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    async function fetchUserPost() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`);

        if (!res.ok) {
          if (res.status === 404) {
            const { error } = await res.json();
            throw new Error(error);
          }
          throw new Error("Failed to fetch post");
        }

        const post = await res.json();

        setPost(post);
      } catch (error) {
        toast.error(error.message);
        navigate("/", { viewTransition: true });
      } finally {
        setLoading(false);
      }
    }

    fetchUserPost();
  }, [postId, navigate]);

  if (loading) return <Loader />;

  return (
    <main className={styles.main}>
      <div className={styles.textContainer1}>
        <h2 className={styles.title}>{post?.title}</h2>
        <p className={styles.date}>
          <strong>Created at: </strong>
          {post && format(post.createdAt, "MMM d, y, H:m:s")}
        </p>
        <p className={styles.date}>
          <strong>Last updated: </strong>
          {post && formatDistanceToNow(post.updatedAt, { addSuffix: true, includeSeconds: true })}
        </p>
      </div>
      <div className={styles.textContainer2}>
        <p className={styles.likes}>
          <strong>Likes:</strong> {post?.likes}
        </p>
        <p className={styles.published}>{post?.published ? "Published" : "Unpublished"}</p>
      </div>
      <div className={styles.textContainer3}>
        <p>Topics:</p>
        <div>
          {post?.Topics.length === 0 ? (
            <span>This post has no topics</span>
          ) : (
            post?.Topics.map((topic, i) => {
              return <p key={i}>{topic.name}</p>;
            })
          )}
        </div>
      </div>
      <div className={styles.postContent}>
        <img src={post?.imgUrl ? post?.imgUrl : noImage} alt="Post cover" />
        <div className={styles.postContentHtml}>{post && parse(post.content)}</div>
      </div>

      <div className={styles.commentsContainer}>
        <div className={styles.headingContainer}>
          <h3>Comments</h3>
        </div>
        <div className={styles.commentsCardsContainer}>
          {post.Comments.length > 0 ? (
            post?.Comments.map((comment) => {
              return <CommentCard key={comment.id} comment={comment} onDelete={handleDeleteComment} />;
            })
          ) : (
            <p className={styles.noComments}>No comments yet!</p>
          )}
        </div>
      </div>
    </main>
  );
}

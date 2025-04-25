import { useState } from "react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import noImage from "../../assets/images/no-image.svg";
import styles from "./Card.module.css";

export default function Card({ post, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const formattedCreatedAt = formatDistanceToNow(post.createdAt, { addSuffix: true, includeSeconds: true });

  async function handlePublishPost() {
    try {
      setLoading(true);
      console.log(post);

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/publish`, {
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ published: !post.published }),
      });

      console.log("RES", res);
      const { msg, post: updatedPost } = await res.json();

      onUpdate(updatedPost);
      toast.success(msg);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <div className={styles.textContainer1}>
          <p className={styles.title}>{post.title}</p>
          <p className={styles.createdAt}>{formattedCreatedAt}</p>
        </div>
        <div className={styles.textContainer2}>
          {post.Topics.length !== 0 &&
            post.Topics.map((topic, i) => {
              return <p key={i}>{topic.name}</p>;
            })}
        </div>
        <div className={styles.textContainer3}>
          <p>
            <strong>Likes: </strong>
            {post.likes}
          </p>
          <label className={styles.switch}>
            <button
              disabled={loading}
              onClick={handlePublishPost}
              className={post.published ? styles.published : ""}
            ></button>
            <span className={`${styles.slider} ${styles.round}`}></span>
          </label>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={post.imgUrl ? post.imgUrl : noImage} alt="Post cover" />
      </div>

      <p className={styles.viewPost}>VIEW</p>
    </div>
  );
}

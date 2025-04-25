import noImage from "../../assets/images/no-image.svg";
import styles from "./Card.module.css";

export default function Card({ post }) {
  console.log(post);

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <div className={styles.textContainer1}>
          <p className={styles.title}>{post.title}</p>
          <p className={styles.createdAt}>{post.createdAt}</p>
        </div>
        <div className={styles.textContainer2}>
          {post.Topics.length !== 0 &&
            post.Topics.map((topic, i) => {
              return <p key={i}>{topic.name}</p>;
            })}
        </div>
        <div className={styles.textContainer3}>
          <p>{post.likes}</p>
          <p>{post.published ? "published" : "unpublished"}</p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={post.imgUrl ? post.imgUrl : noImage} alt="Post cover" />
      </div>

      <p className={styles.viewPost}>VIEW</p>
    </div>
  );
}

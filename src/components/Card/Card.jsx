import styles from "./Card.module.css";

export default function Card({ post }) {
  console.log(post);

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <div className={styles.textContainer1}>
          <p>{post.title}</p>
          <p>{post.createdAt}</p>
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

      <p>VIEW</p>
    </div>
  );
}

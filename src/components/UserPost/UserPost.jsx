import { useState } from "react";
import parse from "html-react-parser";
import styles from "./UserPost.module.css";

export default function UserPost() {
  const [post, setPost] = useState(null);

  return (
    <main>
      <div className={styles.userPostContent}>{parse(post.content)}</div>
    </main>
  );
}

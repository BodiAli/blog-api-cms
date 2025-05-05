import { formatDistanceToNow } from "date-fns";
import anonymousImage from "../../assets/images/anonymous.jpg";
import optionsIcon from "../../assets/images/dots-vertical.svg";
import deleteIcon from "../../assets/images/delete.svg";
import styles from "./CommentCard.module.css";

export default function CommentCard({ comment, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.container1}>
        <div className={styles.commentUserInfo}>
          <img
            src={comment.User.Profile.profileImgUrl ? comment.User.Profile.profileImgUrl : anonymousImage}
            alt={`${comment.User.firstName} ${comment.User.lastName}'s profile picture`}
          />
          <p className={styles.name}>
            {comment.User.firstName} {comment.User.lastName}
          </p>
          <p className={styles.createdAt}>
            {formatDistanceToNow(comment.updatedAt, { addSuffix: true, includeSeconds: true })}
          </p>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropBtn}>
            <img src={optionsIcon} alt="options" />
          </button>
          <div className={styles.dropdownContent}>
            <div onClick={() => onDelete(comment)} className={styles.folderDelete}>
              <img src={deleteIcon} alt="delete comment" />
              <button>Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container2}>
        <p>{comment.content}</p>
      </div>
      <div className={styles.likeContainer}>
        <p className={styles.likes} data-testid="likes-count-comment">
          <strong>Likes:</strong> {comment.likes}
        </p>
      </div>
    </div>
  );
}

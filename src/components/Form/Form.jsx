import PropTypes from "prop-types";
import logBlogIcon from "/images/the-log-blog-icon.svg";
import styles from "./Form.module.css";

export default function Form({ children, onSubmit }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h1>
        <img src={logBlogIcon} alt="The Log Blog icon" />
        The Log Blog
      </h1>
      {children}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.element.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

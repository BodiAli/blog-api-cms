import PropTypes from "prop-types";
import styles from "./Form.module.css";

export default function Form({ children, onSubmit }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.element.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

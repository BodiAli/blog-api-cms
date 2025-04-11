import PropTypes from "prop-types";
import styles from "./FormButton.module.css";

export default function FormButton({ children }) {
  return (
    <button className={styles.button} type="submit">
      {children}
    </button>
  );
}

FormButton.propTypes = {
  children: PropTypes.element.isRequired,
};

import styles from "./FormButton.module.css";

export default function FormButton({ children }) {
  return (
    <button className={styles.button} type="submit">
      {children}
    </button>
  );
}

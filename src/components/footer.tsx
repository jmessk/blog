import styles from "./footer.module.scss";

export default function Footer() {

  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className={styles.container}>
      <div>©{year} jme</div>
    </footer>
  )
}

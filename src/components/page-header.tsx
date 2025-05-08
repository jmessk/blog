import styles from "./page-header.module.scss"

export default function PageHeader({
  title, description
}: {
  title: string, description?: string,
}) {
  return (
    <>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>{title}</h1>
        {description &&
          <div className={styles.description}>{description}</div>
        }
      </div>
    </>
  )
}
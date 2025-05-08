import styles from "./fenced-div.module.scss";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function FencedDiv({
  children,
  type,
}: {
  children: React.ReactNode,
  type: "note" | "warning",
}) {
  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <InfoOutlinedIcon className={styles.icon} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
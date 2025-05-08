import styles from './date.module.scss'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';

export default function Date({
  post,
  update
}: {
  post?: string,
  update?: string,
}) {
  return (
    <div className={styles.container}>
      {post &&
        <div className={styles.postContainer}>
          <AccessTimeIcon className={styles.icon} />
          <div className={styles.date}>{post}</div>
        </div>
      }
      {update &&
        <div className={styles.updateContainer}>
          <UpdateIcon className={styles.icon} />
          <div className={styles.date}>{update}</div>
        </div>
      }
    </div>
  )
}
import styles from "./tag.module.scss"
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

export function Tag({ tags }: { tags?: string[] }) {
  return (
    <>
      {tags &&
        <div className={styles.container}>
          <LocalOfferOutlinedIcon className={styles.icon} />
          <div className={styles.tagContainer}>
            {tags.map((tag) => (
              <div className={styles.tag} key={tag}>{tag}</div>
            ))}
          </div>
        </div>
      }
    </>
  )
}
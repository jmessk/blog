import styles from "./article-header.module.scss"
import { Tag } from "./tag";
import Date from "./date";
import { PostMetadata } from "@/types/post"

export default function ArticleHeader(props: PostMetadata) {
  return ( 
    <>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>{props.title}</h1>
        <div className={styles.description}>{props.description}</div>
        <div className={styles.date}>
          <Date
            post={props.post}
            update={props.update}
          />
        </div>
        <div className={styles.tagContainer}>
          <Tag tags={props.tags} />
        </div>
      </div>
    </>
  )
}
import styles from './island.module.scss';

export default function Island({
  children,
  header2,
  expansion = false
}: {
  children?: React.ReactNode,
  header2?: string,
  expansion?: boolean
}) {

  return (
    <>
      {header2 && <h2 className={styles.header2}>{header2}</h2>}
      <div className={`${styles.container} ${expansion ? "" : styles.enableExpansion}`}>
        {children}
      </div>
    </>
  )
}
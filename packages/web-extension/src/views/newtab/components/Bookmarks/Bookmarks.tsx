import styles from './Bookmarks.module.scss'

export const Bookmarks: preact.FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <span className={styles.load}>Load library</span>
      <div className={styles.bookmark} />
      <div className={styles.bookmark} />
    </div>
  )
}

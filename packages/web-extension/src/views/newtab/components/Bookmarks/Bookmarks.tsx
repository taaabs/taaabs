import styles from './Bookmarks.module.scss'

export const Bookmarks: preact.FunctionComponent = () => {
  return (
    <div
      className={styles.container}
      onClick={() => {
        document.location = 'https://taaabs.com/library'
      }}
    >
      <span className={styles.load}>Load library</span>
      <div className={styles.bookmark} />
    </div>
  )
}

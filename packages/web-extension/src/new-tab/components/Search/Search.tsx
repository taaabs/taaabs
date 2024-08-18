import styles from './Search.module.scss'

export const Search: React.FC = () => {
  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68">
      <path d="M.485 30.448C.485 13.632 14.117 0 30.933 0s30.448 13.632 30.448 30.448a30.33 30.33 0 0 1-6.205 18.424l11.583 11.583a4.114 4.114 0 1 1-5.819 5.819L49.357 54.691a30.33 30.33 0 0 1-18.424 6.205C14.117 60.896.485 47.264.485 30.448m46.16 15.711a22.14 22.14 0 0 0 6.507-15.711c0-12.271-9.948-22.219-22.219-22.219S8.714 18.177 8.714 30.448s9.948 22.219 22.219 22.219a22.14 22.14 0 0 0 15.711-6.508"></path>
    </svg>
  )
  return (
    <a href="https://taaabs.com/library#focus-on-search" className={styles.container}>
      <div className={styles.button}>{icon}</div>
      <div className={styles.placeholder}>
        Search in titles, notes, tags and links...
      </div>
    </a>
  )
}

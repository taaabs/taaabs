import styles from './app.module.scss'
import { Search } from './components/Search'
import { Bookmarks } from './components/Bookmarks'

export const Home: preact.FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div
        className={styles.wrapper}
        onClick={() => {
          document.location = 'https://taaabs.com/library'
        }}
      >
        <div className={styles.inner}>
          <Search />
          <Bookmarks />
        </div>
      </div>
    </div>
  )
}

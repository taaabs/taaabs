import styles from './home.module.scss'
import { Search } from '../../components/Search'

export const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <Search />
        </div>
      </div>
    </div>
  )
}

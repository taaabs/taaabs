import ReactDOM from "react-dom/client";
import styles from './newtab.module.scss'
import { Search } from './components/Search'
import { Bookmarks } from './components/Bookmarks'

import '../../../../web-ui/src/styles/style.scss'

export const NewTab: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <Search />
          <Bookmarks />
        </div>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<NewTab />)
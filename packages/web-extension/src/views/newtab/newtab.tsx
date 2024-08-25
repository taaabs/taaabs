import { render } from 'preact'
import styles from './newtab.module.scss'
import { Search } from './components/Search'
import { Bookmarks } from './components/Bookmarks'

import '../../../../web-ui/src/styles/style.scss'

export const NewTab: preact.FunctionComponent = () => {
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

render(<NewTab />, document.getElementById('root')!)

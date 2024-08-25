import React from 'react'
import ReactDOM from 'react-dom/client'
import styles from './newtab.module.scss'
import { Search } from './components/Search'
import { Bookmarks } from './components/Bookmarks'

import '../../../../web-ui/src/styles/style.scss'
import { App as Ui_app_templates_App } from '@web-ui/components/app/templates/App'
import { HeaderDesktop as Ui_app_templates_App_HeaderDesktop } from '@web-ui/components/app/templates/App/HeaderDesktop'
import { Navigation as Ui_app_templates_App_HeaderDesktop_Navigation } from '@web-ui/components/app/templates/App/HeaderDesktop/Navigation'

export const NewTab: React.FC = () => {
  return (
    <Ui_app_templates_App
      slot_bottom_navigation_bar={<></>}
      slot_header_desktop={
        <Ui_app_templates_App_HeaderDesktop
          slot_left={<></>}
          slot_middle={
            <Ui_app_templates_App_HeaderDesktop_Navigation
              items={[
                {
                  title: 'Home',
                  href: '',
                  icon: 'HOME',
                  filled_icon: 'HOME',
                  is_active: false,
                },
                {
                  title: 'Library',
                  href: '',
                  icon: 'BOOKMARK',
                  filled_icon: 'BOOKMARK_FILLED',
                  is_active: true,
                },
              ]}
            />
          }
          slot_right={<></>}
        />
      }
      slot_header_mobile={<></>}
    >
      <div className={styles.container}>
        <div className={styles.header}></div>
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            <Search />
            <Bookmarks />
          </div>
        </div>
      </div>
    </Ui_app_templates_App>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<NewTab />)

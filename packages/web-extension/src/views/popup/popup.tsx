import styles from './popup.module.scss'
import ReactDOM from 'react-dom/client'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { BottomNavigationBar as Ui_extension_popup_templates_Popup_BottomNavigationBar } from '@web-ui/components/extension/popup/templates/Popup/BottomNavigationBar'
import { useEffect, useState } from 'react'
import { Button as UiButton } from '@web-ui/components/Button'
import { send_message } from './helpers/send-message'

import '../../../../web-ui/src/styles/theme.scss'

export const Popup: React.FC = () => {
  const saved_check_hook = use_saved_check()
  const create_bookmark_hook = use_create_bookmark()

  useEffect(() => {
    console.log('Taaabs popup has been initialized')
  }, [])

  if (saved_check_hook.is_saved === undefined) {
    return <></>
  }

  const saved_items = (
    <>
      <UiButton
        href={
          'https://taaabs.com/library#url=' + encodeURIComponent(location.href)
        }
        rel="noreferrer noopener"
      >
        Edit
      </UiButton>
      <UiButton on_click={() => {}} is_danger={true}>
        Delete
      </UiButton>
    </>
  )

  const unsaved_items = (
    <>
      <UiButton on_click={create_bookmark_hook.create_bookmark}>Save</UiButton>
    </>
  )

  return (
    <div className={styles.container}>
      <Ui_extension_popup_templates_Popup
        header_slot={
          <Ui_extension_popup_templates_Popup_Header
            settings_on_click={() => {
              send_message({ action: 'open-options-page' })
            }}
          />
        }
        bottom_navigation_bar_slot={
          <Ui_extension_popup_templates_Popup_BottomNavigationBar
            items={[
              {
                icon: 'HOME',
                href: 'https://taaabs.com',
                icon_filled: 'HOME_FILLED',
              },
              {
                icon: 'BOOKMARK',
                href: 'https://taaabs.com/library',
                icon_filled: 'BOOKMARK_FILLED',
              },
            ]}
          />
        }
      >
        <Ui_extension_popup_templates_Popup_main_Actions>
          {saved_check_hook.is_saved ? saved_items : unsaved_items}
        </Ui_extension_popup_templates_Popup_main_Actions>
      </Ui_extension_popup_templates_Popup>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root-taaabs-popup') as HTMLElement,
)
root.render(<Popup />)

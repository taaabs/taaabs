import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { Button as UiButton } from '@web-ui/components/Button'
import React from 'react'
import browser from 'webextension-polyfill'
import { usePopup } from '../../App'
import { use_create_bookmark } from './use-create-bookmark'
import { use_delete_bookmark } from './use-delete-bookmark'

export const Actions: React.FC = () => {
  const {
    auth_state_hook,
    current_url_hook,
    saved_check_hook,
    parsed_html_hook,
  } = usePopup()
  const create_bookmark_hook = use_create_bookmark({
    set_is_saved: saved_check_hook.set_is_saved,
  })
  const delete_bookmark_hook = use_delete_bookmark({
    current_url: current_url_hook.url,
    set_is_saved: saved_check_hook.set_is_saved,
  })

  const saved_items = [
    <UiButton
      key="edit"
      href={
        'https://taaabs.com/library#url=' +
        encodeURIComponent(current_url_hook.url)
      }
      on_click={async (e) => {
        e.preventDefault()
        const [current_tab] = await browser.tabs.query({
          active: true,
          currentWindow: true,
        })
        browser.tabs.update(current_tab.id, {
          url:
            'https://taaabs.com/library#url=' +
            encodeURIComponent(current_url_hook.url),
        })
        window.close()
      }}
      rel="noreferrer noopener"
      is_disabled={delete_bookmark_hook.is_deleting}
    >
      Edit
    </UiButton>,
    <UiButton
      key="delete"
      on_click={delete_bookmark_hook.delete_bookmark}
      is_danger={true}
      is_disabled={delete_bookmark_hook.is_deleting}
    >
      Delete
    </UiButton>,
  ]

  const unsaved_items = [
    <UiButton
      key="clip"
      on_click={() => {
        create_bookmark_hook.create_bookmark({
          reader_data: parsed_html_hook.parsed_html?.reader_data,
        })
      }}
      is_disabled={create_bookmark_hook.is_creating}
    >
      Clip this page
    </UiButton>,
  ]

  return (
    <Ui_extension_popup_templates_Popup_main_Actions>
      <UiButton
        href='https://taaabs.com/library'
        rel="noreferrer noopener"
        is_outlined={true}
        on_click={async (e) => {
          e.preventDefault()
          const [current_tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
          })
          browser.tabs.update(current_tab.id, {
            url: 'https://taaabs.com/library#fresh',
          })
          window.close()
        }}
      >
        {auth_state_hook.is_authenticated ? 'Go to library' : 'Sign in'}
      </UiButton>
      {auth_state_hook.is_authenticated &&
        !current_url_hook.is_new_tab_page &&
        (saved_check_hook.is_saved ? saved_items : unsaved_items)}
    </Ui_extension_popup_templates_Popup_main_Actions>
  )
}

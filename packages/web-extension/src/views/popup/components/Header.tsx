import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { HeaderVision as Ui_extension_popup_templates_Popup_HeaderVision } from '@web-ui/components/extension/popup/templates/Popup/HeaderVision'
import browser from 'webextension-polyfill'
import { usePopup } from '../App'

export const Header: React.FC = () => {
  const { vision_mode_hook, current_url_hook } = usePopup()

  return vision_mode_hook.is_vision_mode ? (
    <Ui_extension_popup_templates_Popup_HeaderVision
      key={vision_mode_hook.original_image}
      back_button_on_click={vision_mode_hook.exit_vision_mode}
      image={vision_mode_hook.original_image}
      on_resize={vision_mode_hook.set_image}
      translations={{
        title: 'Vision',
        restore: 'Restore',
        loading: 'Loading...',
      }}
    />
  ) : (
    <Ui_extension_popup_templates_Popup_Header
      vision_mode_on_click={vision_mode_hook.enter_vision_mode}
      is_vision_mode_available={
        !current_url_hook.is_new_tab_page &&
        !current_url_hook.url.startsWith('https://taaabs.com')
      }
      settings_on_click={() => {
        browser.runtime.openOptionsPage()
        // Firefox requires closing manually
        if (browser.browserAction) window.close()
      }}
      logo_on_click={async () => {
        browser.tabs.create({
          url: 'https://taaabs.com/',
        })
        window.close()
      }}
      translations={{
        trigger_popup_shortcut: 'Trigger popup shortcut',
      }}
    />
  )
}

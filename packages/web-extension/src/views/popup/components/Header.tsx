import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { HeaderVision as Ui_extension_popup_templates_Popup_HeaderVision } from '@web-ui/components/extension/popup/templates/Popup/HeaderVision'
import browser from 'webextension-polyfill'
import { use_popup } from '../App'

export const Header: React.FC = () => {
  const { vision_mode_hook, current_tab_hook } = use_popup()

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
      settings_on_click={() => {
        browser.runtime.openOptionsPage()
        // Firefox requires closing manually
        if (browser.browserAction) window.close()
      }}
      logo_on_click={
        !current_tab_hook.url.startsWith('https://taaabs.com')
          ? async () => {
              if (current_tab_hook.is_new_tab_page) {
                await browser.tabs.update({
                  url: 'https://taaabs.com/',
                })
              } else {
                browser.tabs.create({
                  url: 'https://taaabs.com/',
                })
              }
              window.close()
            }
          : undefined
      }
      translations={{
        trigger_popup_shortcut: 'Trigger popup shortcut',
      }}
    />
  )
}

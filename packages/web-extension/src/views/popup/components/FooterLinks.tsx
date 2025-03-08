import { FooterLinks as Ui_extension_popup_templates_Popup_main_FooterLinks } from '@web-ui/components/extension/popup/templates/Popup/main/FooterLinks'
import browser from 'webextension-polyfill'

export const FooterLinks: React.FC = () => {
  const is_chrome = browser.runtime.getURL('').startsWith('chrome-extension://')

  const links = [
    {
      href: 'https://github.com/taaabs/taaabs',
      text: 'GitHub',
    },
    {
      href: is_chrome
        ? 'https://chromewebstore.google.com/detail/taaabs-free-zero-knowledg/mfpmbjjgeklnhjmpahigldafhcdoaona'
        : 'https://addons.mozilla.org/pl/firefox/addon/taaabs/',
      text: 'Rate extension',
    },
    {
      href: 'https://buymeacoffee.com/robertpiosik',
      text: 'Donate',
    },
  ]

  return (
    <Ui_extension_popup_templates_Popup_main_FooterLinks
      links={links}
      on_link_click={(url) => {
        browser.tabs.create({ url })
        window.close()
      }}
      on_get_help_click={() => {
        browser.tabs.create({ url: 'https://taaabs.com/' })
        window.close()
      }}
    />
  )
}

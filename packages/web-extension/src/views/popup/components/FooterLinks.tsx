import { FooterLinks as Ui_extension_popup_templates_Popup_main_FooterLinks } from '@web-ui/components/extension/popup/templates/Popup/main/FooterLinks'

export const FooterLinks: React.FC = () => {
  const links = [
    {
      href: 'https://github.com/taaabs/taaabs',
      text: 'Star on GitHub',
    },
    {
      href: 'https://buymeacoffee.com/robertpiosik',
      text: 'Buy me a coffee',
    },
    {
      href: 'https://github.com/taaabs/taaabs/discussions',
      text: 'Send feedback',
    },
  ]

  return <Ui_extension_popup_templates_Popup_main_FooterLinks links={links} />
}

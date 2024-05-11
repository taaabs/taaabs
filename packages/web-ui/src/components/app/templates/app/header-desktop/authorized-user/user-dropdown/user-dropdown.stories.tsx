import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { UserDropdown } from './user-dropdown'

export default {
  component: UserDropdown,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <UserDropdown
        username_="Lorem"
        profile_url_=""
        on_click_log_out_={() => {}}
        footer_links_={[{ href_: '', label_: 'Lorem' }]}
        settings_href_="/"
        translations_={{
          bookmarklet_: 'Save to taaabs',
          theme_: 'Theme',
          log_out_: 'Log out',
          settings_: 'Settings',
        }}
      />
      <StorybookSpacer />
    </StorybookMargin>
  )
}

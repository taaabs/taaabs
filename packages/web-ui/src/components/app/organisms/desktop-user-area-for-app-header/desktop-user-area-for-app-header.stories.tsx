import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { DesktopUserAreaForAppHeader } from './desktop-user-area-for-app-header'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: DesktopUserAreaForAppHeader,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopUserAreaForAppHeader
        add_on_click={() => {}}
        search_on_click={() => {}}
        notificatios_on_click={() => {}}
      />
      <StorybookSpacer />
      <DesktopUserAreaForAppHeader
        add_on_click={() => {}}
        search_on_click={() => {}}
        notificatios_on_click={() => {}}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
      />
    </StorybookMargin>
  )
}

import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { DesktopUserAreaForAppHeader } from './DesktopUserAreaForAppHeader'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'

export default {
  component: DesktopUserAreaForAppHeader,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopUserAreaForAppHeader
        onClickAdd={() => {}}
        onClickSearch={() => {}}
        onClickTheme={() => {}}
        currentTheme="LIGHT"
        onClickNotifications={() => {}}
      />
      <StorybookSpacer />
      <DesktopUserAreaForAppHeader
        onClickAdd={() => {}}
        onClickSearch={() => {}}
        onClickTheme={() => {}}
        onClickNotifications={() => {}}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
        currentTheme="LIGHT"
      />
    </StorybookMargin>
  )
}

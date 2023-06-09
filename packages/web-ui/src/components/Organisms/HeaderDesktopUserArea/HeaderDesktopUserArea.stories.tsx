import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { HeaderDesktopUserArea } from './HeaderDesktopUserArea'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'

export default {
  component: HeaderDesktopUserArea,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <HeaderDesktopUserArea
        onClickAdd={() => {}}
        onClickSearch={() => {}}
        onClickTheme={() => {}}
        currentTheme="LIGHT"
        onClickNotifications={() => {}}
      />
      <StorybookSpacer />
      <HeaderDesktopUserArea
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

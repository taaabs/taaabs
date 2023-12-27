import { Helpers } from '@web-ui'
import { DesktopUserAreaForAppHeader } from './desktop-user-area-for-app-header'

export default {
  component: DesktopUserAreaForAppHeader,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <DesktopUserAreaForAppHeader
        on_click_add={() => {}}
        on_click_search={() => {}}
      />
      <Helpers.Storybook.StorybookSpacer />
      <DesktopUserAreaForAppHeader
        on_click_add={() => {}}
        on_click_search={() => {}}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
      />
    </Helpers.Storybook.StorybookMargin>
  )
}

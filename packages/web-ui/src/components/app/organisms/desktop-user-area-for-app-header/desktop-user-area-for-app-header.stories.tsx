import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { DesktopUserAreaForAppHeader } from './desktop-user-area-for-app-header'

export default {
  component: DesktopUserAreaForAppHeader,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopUserAreaForAppHeader
        on_click_add={() => {}}
        on_click_search={() => {}}
        name="Lorem"
        slot_user_dropdown={<>dropdown</>}
      />
      <StorybookSpacer />
      <DesktopUserAreaForAppHeader
        on_click_add={() => {}}
        on_click_search={() => {}}
        name="Lorem"
        slot_user_dropdown={<>dropdown</>}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
      />
    </StorybookMargin>
  )
}

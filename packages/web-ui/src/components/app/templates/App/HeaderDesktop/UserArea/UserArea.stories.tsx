import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { UserArea } from './UserArea'

export default {
  component: UserArea,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <UserArea
        pathname=""
        on_click_add={() => {}}
        name="Lorem"
        slot_user_dropdown={<>dropdown</>}
      />
      <StorybookSpacer />
      <UserArea
        pathname=""
        on_click_add={() => {}}
        name="Lorem"
        slot_user_dropdown={<>dropdown</>}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
      />
      <UserArea
        pathname=""
        on_click_add={() => {}}
        slot_user_dropdown={<>dropdown</>}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
      />
    </StorybookMargin>
  )
}

import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { AuthorizedUser } from './authorized-user'

export default {
  component: AuthorizedUser,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <AuthorizedUser
        on_click_add={() => {}}
        on_click_search={() => {}}
        name="Lorem"
        slot_user_dropdown={<>dropdown</>}
      />
      <StorybookSpacer />
      <AuthorizedUser
        on_click_add={() => {}}
        on_click_search={() => {}}
        name="Lorem"
        slot_user_dropdown={<>dropdown</>}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
      />
      <AuthorizedUser
        on_click_add={() => {}}
        on_click_search={() => {}}
        slot_user_dropdown={<>dropdown</>}
        avatar={{
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        }}
      />
    </StorybookMargin>
  )
}

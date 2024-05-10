import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { ButtonDesktopUser } from './button-user-desktop'

export default {
  component: ButtonDesktopUser,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonDesktopUser
      name="Lorem ipsum"
      avatar={{
        src: 'https://picsum.photos/300',
        blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
      }}
      on_click={() => {}}
    />
    <StorybookSpacer />
    <ButtonDesktopUser name="Lorem ipsum" on_click={() => {}} />
  </StorybookMargin>
)

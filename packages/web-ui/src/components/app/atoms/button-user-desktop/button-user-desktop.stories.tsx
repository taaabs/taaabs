import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { ButtonUserDesktop } from './button-user-desktop'

export default {
  component: ButtonUserDesktop,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonUserDesktop
      name="Lorem ipsum"
      avatar={{
        url: 'https://picsum.photos/300',
        blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
      }}
      on_click={() => {}}
    />
    <StorybookSpacer />
    <ButtonUserDesktop
      avatar={{
        url: 'https://picsum.photos/300',
        blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
      }}
      on_click={() => {}}
    />
    <StorybookSpacer />
    <ButtonUserDesktop name="Lorem ipsum" on_click={() => {}} />
  </StorybookMargin>
)

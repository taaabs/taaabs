import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { ButtonAvatar } from './button-avatar'

export default {
  component: ButtonAvatar,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonAvatar
      url="https://picsum.photos/300"
      blurhash="KGF5?xYk^6@-5c,1@[or[Q"
      alt="XYZ"
      on_click={() => {}}
    />
  </StorybookMargin>
)

import { Helpers } from '@web-ui'
import { ButtonAvatar } from './button-avatar'

export default {
  component: ButtonAvatar,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    <ButtonAvatar
      url="https://picsum.photos/300"
      blurhash="KGF5?xYk^6@-5c,1@[or[Q"
      alt="XYZ"
      on_click={() => {}}
    />
  </Helpers.Storybook.StorybookMargin>
)

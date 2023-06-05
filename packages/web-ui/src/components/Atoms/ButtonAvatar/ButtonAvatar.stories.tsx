import { ButtonAvatar } from './ButtonAvatar'
import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'

export default {
  component: ButtonAvatar,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonAvatar
      url="https://picsum.photos/300"
      blurhash="KGF5?xYk^6@-5c,1@[or[Q"
      onClick={() => {}}
    />
  </StorybookMargin>
)

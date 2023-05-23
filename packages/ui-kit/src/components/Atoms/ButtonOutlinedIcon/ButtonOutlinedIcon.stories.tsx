import { ButtonOutlinedIcon } from './ButtonOutlinedIcon'
import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'

export default {
  component: ButtonOutlinedIcon,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonOutlinedIcon iconVariant="ADD" onClick={() => {}} />
    <StorybookSpacer />
    <ButtonOutlinedIcon
      avatar={{
        url: 'https://picsum.photos/300',
        blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
      }}
      onClick={() => {}}
    />
  </StorybookMargin>
)

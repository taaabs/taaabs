import { Meta } from '@storybook/react'
import { ButtonOutlinedIcon } from './ButtonOutlinedIcon'
import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'

export default {
  title: 'Atoms/ButtonOutlinedIcon',
  component: ButtonOutlinedIcon,
} as Meta

export const standard = () => (
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

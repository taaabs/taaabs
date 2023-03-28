import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta } from '@storybook/react'
import { ButtonUnderlined } from './ButtonUnderlined'

export default {
  title: 'Atoms/ButtonUnderlined',
  component: ButtonUnderlined,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <Wrapper>
      <ButtonUnderlined isActive={true} href="/">
        Lorem ispum
      </ButtonUnderlined>
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined isActive={false} href="/">
        Lorem ispum
      </ButtonUnderlined>
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined isActive={true} onClick={() => {}}>
        Lorem ispum
      </ButtonUnderlined>
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined isActive={true}>Lorem ispum</ButtonUnderlined>
    </Wrapper>
  </StorybookMargin>
)

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ height: '50px', width: '200px' }}>{children}</div>
}

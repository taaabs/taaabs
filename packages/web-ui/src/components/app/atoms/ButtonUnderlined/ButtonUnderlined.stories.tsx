import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'
import { ButtonUnderlined } from './ButtonUnderlined'

export default {
  component: ButtonUnderlined,
}

export const Primary = () => (
  <StorybookMargin>
    <_Wrapper>
      <ButtonUnderlined isActive={true} href="/" label="Lorem ispum" />
      <StorybookSpacer />
      <ButtonUnderlined isActive={false} href="/" label="Lorem ispum" />
      <StorybookSpacer />
      <ButtonUnderlined
        isActive={true}
        onClick={() => {}}
        label="Lorem ispum"
      />
      <StorybookSpacer />
      <ButtonUnderlined isActive={false} label="Lorem ispum" />
    </_Wrapper>
  </StorybookMargin>
)

const _Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ height: '50px', width: '200px' }}>{children}</div>
}

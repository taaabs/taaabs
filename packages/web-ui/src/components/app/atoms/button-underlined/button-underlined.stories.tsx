import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'
import { ButtonUnderlined } from './button-underlined'

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

import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { ButtonUnderlined } from './button-underlined'

export default {
  component: ButtonUnderlined,
}

export const Primary = () => (
  <StorybookMargin>
    <Wrapper>
      <ButtonUnderlined is_active={true} href="/" label="Lorem ispum" />
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined is_active={false} href="/" label="Lorem ispum" />
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined
        is_active={true}
        on_click={() => {}}
        label="Lorem ispum"
      />
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined is_active={false} label="Lorem ispum" />
    </Wrapper>
  </StorybookMargin>
)

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ height: '50px', width: '200px' }}>{children}</div>
}

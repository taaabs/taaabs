import { Helpers } from '@web-ui'
import { ButtonUnderlined } from './button-underlined'

export default {
  component: ButtonUnderlined,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    <Wrapper>
      <ButtonUnderlined is_active={true} href="/" label="Lorem ispum" />
    </Wrapper>
    <Helpers.Storybook.StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined is_active={false} href="/" label="Lorem ispum" />
    </Wrapper>
    <Helpers.Storybook.StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined
        is_active={true}
        on_click={() => {}}
        label="Lorem ispum"
      />
    </Wrapper>
    <Helpers.Storybook.StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined is_active={false} label="Lorem ispum" />
    </Wrapper>
  </Helpers.Storybook.StorybookMargin>
)

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ height: '50px', width: '200px' }}>{children}</div>
}

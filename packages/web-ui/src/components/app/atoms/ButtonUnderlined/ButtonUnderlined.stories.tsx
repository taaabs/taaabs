import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'
import { ButtonUnderlined } from './ButtonUnderlined'

export default {
  component: ButtonUnderlined,
}

export const Primary = () => (
  <StorybookMargin>
    <Wrapper>
      <ButtonUnderlined isActive={true} href="/" label="Lorem ispum" />
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined isActive={false} href="/" label="Lorem ispum" />
      Lorem ispum
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined
        isActive={true}
        onClick={() => {}}
        label="Lorem ispum"
      />
      Lorem ispum
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <ButtonUnderlined isActive={false} label="Lorem ispum" />
    </Wrapper>
  </StorybookMargin>
)

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ height: '50px', width: '200px' }}>{children}</div>
}

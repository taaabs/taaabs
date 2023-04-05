import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta } from '@storybook/react'
import { Tab } from './Tab'

export default {
  title: 'Atoms/Tab',
  component: Tab,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <Wrapper>
      <Tab isActive={true} href="/">
        Lorem ispum
      </Tab>
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <Tab isActive={false} href="/">
        Lorem ispum
      </Tab>
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <Tab isActive={true} onClick={() => {}}>
        Lorem ispum
      </Tab>
    </Wrapper>
    <StorybookSpacer />
    <Wrapper>
      <Tab isActive={false}>Lorem ispum</Tab>
    </Wrapper>
  </StorybookMargin>
)

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ height: '50px', width: '200px' }}>{children}</div>
}

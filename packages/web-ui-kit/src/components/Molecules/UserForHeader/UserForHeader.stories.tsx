import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { UserForHeader } from '.'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'

export default {
  component: UserForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <UserForHeader />
    <StorybookSpacer />
    <UserForHeader user={{ username: 'lorem', backHref: '/lorem' }} />
  </StorybookMargin>
)

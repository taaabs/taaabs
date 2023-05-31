import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { UserForHeader } from '.'

export default {
  component: UserForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <UserForHeader user={{ username: 'lorem', backHref: '/lorem' }} />
  </StorybookMargin>
)

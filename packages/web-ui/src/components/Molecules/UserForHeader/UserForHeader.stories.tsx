import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { UserForHeader } from '.'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'

export default {
  component: UserForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <UserForHeader user={{ username: 'lorem', backHref: '/lorem' }} />
    <StorybookSpacer />
    <UserForHeader
      user={{
        username: 'lorem',
        backHref: '/lorem',
        avatar: {
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        },
      }}
    />
  </StorybookMargin>
)

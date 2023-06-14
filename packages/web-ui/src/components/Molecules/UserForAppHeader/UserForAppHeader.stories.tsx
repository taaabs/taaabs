import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { UserForAppHeader } from '.'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'

export default {
  component: UserForAppHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <UserForAppHeader user={{ username: 'lorem', backHref: '/lorem' }} />
    <StorybookSpacer />
    <UserForAppHeader
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

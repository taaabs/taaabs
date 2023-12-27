import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { UserForHeader } from '.'

export default {
  component: UserForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <UserForHeader
      user={{ username: 'lorem', back_href: '/lorem' }}
      is_loading_avatar={false}
    />
    <StorybookSpacer />
    <UserForHeader
      user={{
        username: 'lorem',
        back_href: '/lorem',
        avatar: {
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        },
      }}
      is_loading_avatar={false}
    />
  </StorybookMargin>
)

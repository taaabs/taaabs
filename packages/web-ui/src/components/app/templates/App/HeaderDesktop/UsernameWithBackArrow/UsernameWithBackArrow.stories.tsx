import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { UsernameWithBackArrow } from '.'

export default {
  component: UsernameWithBackArrow,
}

export const Primary = () => (
  <StorybookMargin>
    <UsernameWithBackArrow
      user={{ username: 'lorem', back_href: '/lorem' }}
      is_loading_avatar={false}
    />
    <StorybookSpacer />
    <UsernameWithBackArrow
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

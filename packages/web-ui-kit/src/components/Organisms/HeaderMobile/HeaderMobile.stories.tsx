import { HeaderMobile } from './HeaderMobile'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'

export default {
  component: HeaderMobile,
}

export const Primary = () => (
  <div css={{ maxWidth: '400px', width: '100%' }}>
    <HeaderMobile
      hamburgerIsToggled={false}
      onClickHamburger={() => {}}
      currentTheme="LIGHT"
      onClickTheme={() => {}}
      navigation={[
        { label: 'Lorem', href: '/', isActive: true },
        { label: 'Ipsum', href: '/about', isActive: false },
      ]}
    />
    <StorybookSpacer />
    <HeaderMobile
      hamburgerIsToggled={false}
      onClickHamburger={() => {}}
      currentTheme="LIGHT"
      onClickTheme={() => {}}
      otherUserAccount={{
        backHref: '/',
        username: 'lorem',
        avatar: {
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        },
      }}
      navigation={[
        { label: 'Lorem', href: '/', isActive: true },
        { label: 'Ipsum', href: '/about', isActive: false },
      ]}
    />
  </div>
)

import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { HeaderDesktop } from './HeaderDesktop'

export default {
  component: HeaderDesktop,
}

const navItemsLoggedInUser: HeaderDesktop.Navigation = [
  { label: 'My Library', href: '/', isActive: true },
  { label: 'Notifications', href: '/notifications', isActive: false },
  { label: 'Explore', href: '/explore', isActive: false },
]

export const Primary = () => (
  <StorybookMargin>
    Guest:
    <StorybookSpacer />
    <HeaderDesktop
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      onClickAdd={() => {}}
      navigation={[
        { label: 'Explore', href: '/', isActive: true },
        { label: 'About', href: '/about', isActive: false },
        { label: 'Pricing', href: '/pricing', isActive: false },
      ]}
    />
    <StorybookSpacer />
    Logged in user:
    <StorybookSpacer />
    <HeaderDesktop
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      onClickAdd={() => {}}
      loggedInUser={{ username: 'lorem', displayName: 'Lorem ipsum' }}
      navigation={navItemsLoggedInUser}
    />
    <StorybookSpacer />
    Logged in user with avatar:
    <StorybookSpacer />
    <HeaderDesktop
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      onClickAdd={() => {}}
      loggedInUser={{
        username: 'lorem',
        displayName: 'Lorem ipsum',
        avatar: {
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        },
      }}
      navigation={navItemsLoggedInUser}
    />
    <StorybookSpacer />
    Viewing another user
    <StorybookSpacer />
    <HeaderDesktop
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      onClickAdd={() => {}}
      loggedInUser={{ username: 'lorem', displayName: 'Lorem ipsum' }}
      navigation={navItemsLoggedInUser}
      viewedUser={{
        backHref: '/',
        username: 'lorem',
        avatar: {
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        },
      }}
    />
  </StorybookMargin>
)

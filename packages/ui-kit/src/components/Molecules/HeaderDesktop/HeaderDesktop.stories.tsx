import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta } from '@storybook/react'
import { HeaderDesktop } from './HeaderDesktop'

export default {
  title: 'Molecules/HeaderDesktop',
  component: HeaderDesktop,
} as Meta

const navItemsLoggedInUser: HeaderDesktop.NavItem[] = [
  { label: 'My Library', href: '/', isActive: true },
  { label: 'Notifications', href: '/notifications', isActive: false },
  { label: 'Explore', href: '/explore', isActive: false },
]

export const standard = () => (
  <StorybookMargin>
    Guest:
    <StorybookSpacer />
    <HeaderDesktop
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      onClickAdd={() => {}}
      navItems={[
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
      user={{ username: 'lorem', displayName: 'Lorem ipsum' }}
      navItems={navItemsLoggedInUser}
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
      user={{
        username: 'lorem',
        displayName: 'Lorem ipsum',
        avatar: {
          url: 'https://picsum.photos/300',
          blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
        },
      }}
      navItems={navItemsLoggedInUser}
    />
  </StorybookMargin>
)

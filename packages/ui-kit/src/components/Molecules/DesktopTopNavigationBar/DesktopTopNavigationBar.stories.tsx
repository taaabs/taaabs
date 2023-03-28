import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta } from '@storybook/react'
import { DesktopTopNavigationBar } from './DesktopTopNavigationBar'

export default {
  title: 'Molecules/DesktopTopNavigationBar',
  component: DesktopTopNavigationBar,
} as Meta

const navItemsLoggedInUser: DesktopTopNavigationBar.NavItem[] = [
  { label: 'My Library', href: '/', isActive: true },
  { label: 'Notifications', href: '/notifications', isActive: false },
  { label: 'Explore', href: '/explore', isActive: false },
]

export const combined = () => (
  <StorybookMargin>
    Guest:
    <StorybookSpacer />
    <DesktopTopNavigationBar
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      navItems={[
        { label: 'Explore', href: '/', isActive: true },
        { label: 'About', href: '/about', isActive: false },
        { label: 'Pricing', href: '/pricing', isActive: false },
      ]}
    />
    <StorybookSpacer />
    Logged in user:
    <StorybookSpacer />
    <DesktopTopNavigationBar
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      user={{ username: 'lorem', displayName: 'Lorem ipsum' }}
      navItems={navItemsLoggedInUser}
    />
    <StorybookSpacer />
    Logged in user with avatar:
    <StorybookSpacer />
    <DesktopTopNavigationBar
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      onClickSignIn={() => {}}
      user={{
        username: 'lorem',
        displayName: 'Lorem ipsum',
        avatarUrl: 'https://picsum.photos/300/200',
      }}
      navItems={navItemsLoggedInUser}
    />
  </StorybookMargin>
)

import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/helpers/components/StorybookSpacer'
import { Meta } from '@storybook/react'
import { DesktopTopNavigationBar } from './DesktopTopNavigationBar'

export default {
  title: 'Molecules/DesktopTopNavigationBar',
  component: DesktopTopNavigationBar,
} as Meta

export const combined = () => (
  <StorybookMargin>
    Guest:
    <StorybookSpacer />
    <DesktopTopNavigationBar
      breadcrumbs={[]}
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      pageTitle="x"
      user={{ username: 'lorem', displayName: 'Lorem ipsum' }}
    />
    <StorybookSpacer />
    Logged in user:
    <StorybookSpacer />
    <DesktopTopNavigationBar
      breadcrumbs={[]}
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      pageTitle="Lorem ipsum"
      user={{ username: 'lorem', displayName: 'Lorem ipsum' }}
    />
    <StorybookSpacer />
    Logged in user with breadcrumbs:
    <StorybookSpacer />
    <DesktopTopNavigationBar
      breadcrumbs={[
        { title: 'Lorem', link: '/lorem' },
        { title: 'Lorem', link: '/lorem' },
        { title: 'Lorem', link: '/lorem' },
      ]}
      currentTheme={'LIGHT'}
      onClickSearch={() => {}}
      onClickTheme={() => {}}
      pageTitle="Lorem ipsum"
      user={{ username: 'lorem', displayName: 'Lorem ipsum' }}
    />
  </StorybookMargin>
)

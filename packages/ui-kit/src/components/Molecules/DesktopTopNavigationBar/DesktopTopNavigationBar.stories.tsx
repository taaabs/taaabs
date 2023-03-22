import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { css } from '@emotion/react'
import { Meta } from '@storybook/react'
import { DesktopTopNavigationBar } from './DesktopTopNavigationBar'

export default {
  title: 'Molecules/DesktopTopNavigationBar',
  component: DesktopTopNavigationBar,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <DesktopTopNavigationBar />
  </StorybookMargin>
)

import { Meta, Story } from '@storybook/react'
import {
  UiOrgLandingFeatureGrid,
  UiOrgLandingFeatureGridProps,
} from './UiOrgLandingFeatureGrid'
import { uiOrgLandingFeatureGridPropsData } from './UiOrgLandingFratureGrid.data'

export default {
  title: 'Organisms/UiOrgLandingFeatureGrid',
  component: UiOrgLandingFeatureGrid,
} as Meta

const template: Story<UiOrgLandingFeatureGridProps> = (props) => (
  <UiOrgLandingFeatureGrid {...props}></UiOrgLandingFeatureGrid>
)

export const standard = template.bind({})
standard.args = uiOrgLandingFeatureGridPropsData

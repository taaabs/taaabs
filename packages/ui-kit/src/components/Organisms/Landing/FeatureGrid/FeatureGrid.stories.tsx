import { Meta, Story } from '@storybook/react'
import {
  FeatureGrid,
  FeatureGridProps,
} from './FeatureGrid'
import { FeatureGridPropsData } from './FratureGrid.data'

export default {
  title: 'Organisms/Landing/FeatureGrid',
  component: FeatureGrid,
} as Meta

const template: Story<FeatureGridProps> = (props) => (
  <FeatureGrid {...props}></FeatureGrid>
)

export const standard = template.bind({})
standard.args = FeatureGridPropsData

import { Meta, Story } from '@storybook/react'
import { FeatureGrid, FeatureGridTypes } from './FeatureGrid'
import { FeatureGridPropsData } from './FratureGrid.data'

export default {
  title: 'Organisms/Landing/Sections/FeatureGrid',
  component: FeatureGrid,
} as Meta

const template: Story<FeatureGridTypes.Props> = (props) => (
  <FeatureGrid {...props}></FeatureGrid>
)

export const standard = template.bind({})
standard.args = FeatureGridPropsData

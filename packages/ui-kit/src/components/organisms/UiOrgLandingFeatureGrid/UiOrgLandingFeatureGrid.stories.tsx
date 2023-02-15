import { Meta, Story } from '@storybook/react'
import { UiOrgLandingFeatureGrid, UiOrgLandingFeatureGridProps } from './UiOrgLandingFeatureGrid'

export default {
  title: 'Organisms/UiOrgLandingFeatureGrid',
  component: UiOrgLandingFeatureGrid,
} as Meta

const template: Story<UiOrgLandingFeatureGridProps> = (props) => (
  <UiOrgLandingFeatureGrid {...props}></UiOrgLandingFeatureGrid>
)

export const standard = template.bind({})
standard.args = {
  gridItems: [
    {
      firstLine: 'lag free',
      secondLine: 'crazy fast\nloading times',
      thirdLine: 'locally synced\nacross all devices',
    },
    {
      firstLine: 'secure',
      secondLine: 'end-to-end encrypted\nprivate collections',
      thirdLine: 'protected with your\nvery own seed phase',
    },
    {
      firstLine: 'social',
      secondLine: 'explore public\ncollections',
      thirdLine: 'make them part\nof your own',
    },
    {
      firstLine: 'seamless',
      secondLine: 'integrates with\nevery device',
      thirdLine: 'native apps and\nbrowser extensions',
    },
  ],
}

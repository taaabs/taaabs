import { loremIpsum } from '@/helpers/storybook/lorem-ipsum'
import { Meta } from '@storybook/react'
import { LayoutLanding } from './LayoutLanding'

export default {
  title: 'Layouts/LayoutLanding',
  component: LayoutLanding,
} as Meta

export const standard = () => (
  <LayoutLanding slotFooter={<>footer</>}>{loremIpsum.long}</LayoutLanding>
)

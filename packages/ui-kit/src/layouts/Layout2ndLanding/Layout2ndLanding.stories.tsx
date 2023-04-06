import { loremIpsum } from '@/helpers/storybook/lorem-ipsum'
import { Meta } from '@storybook/react'
import { Layout2ndLanding } from './Layout2ndLanding'

export default {
  title: 'Layouts/Layout2ndLanding',
  component: Layout2ndLanding,
} as Meta

export const standard = () => (
  <Layout2ndLanding slotFooter={<>footer</>}>
    {loremIpsum.long}
  </Layout2ndLanding>
)

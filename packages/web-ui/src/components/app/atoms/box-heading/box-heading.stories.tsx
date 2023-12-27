import { Helpers } from '@web-ui'
import { BoxHeading } from './box-heading'

export default {
  component: BoxHeading,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <BoxHeading heading="Lorem" subheading="Ipsum" />
    </Helpers.Storybook.StorybookMargin>
  )
}

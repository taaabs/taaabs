import { StorybookMargin } from '@web-ui/helpers/storybook'
import { BoxHeading } from './box-heading'

export default {
  component: BoxHeading,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <BoxHeading heading="Lorem" subheading="Ipsum" />
    </StorybookMargin>
  )
}

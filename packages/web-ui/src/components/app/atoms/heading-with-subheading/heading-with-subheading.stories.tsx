import { StorybookMargin } from '@web-ui/helpers/storybook'
import { HeadingWithSubheading } from './heading-with-subheading'

export default {
  component: HeadingWithSubheading,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <HeadingWithSubheading heading="Lorem" subheading="Ipsum" />
    </StorybookMargin>
  )
}

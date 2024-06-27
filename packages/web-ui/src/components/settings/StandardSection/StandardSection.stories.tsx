import { StorybookMargin } from '@web-ui/helpers/storybook'
import { StandardSection } from './StandardSection'

export default {
  component: StandardSection,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <StandardSection heading="Lorem" subheading="Ipsum">
        children
      </StandardSection>
    </StorybookMargin>
  )
}

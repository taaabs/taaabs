import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Select } from './select'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: Select,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ width: '300px' }}>
        <Select label="Lorem ipsum" currentValue="Lorem ipsum" />
        <StorybookSpacer />
        <Select
          label="Lorem ipsum"
          currentValue="Lorem ipsum"
          isActive={true}
        />
      </div>
    </StorybookMargin>
  )
}

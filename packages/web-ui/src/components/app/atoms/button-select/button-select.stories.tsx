import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { ButtonSelect } from './button-select'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: ButtonSelect,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ width: '300px' }}>
        <ButtonSelect
          label="Lorem ipsum"
          currentValue="Lorem ipsum"
          onClick={() => {}}
        />
        <StorybookSpacer />
        <ButtonSelect
          label="Lorem ipsum"
          currentValue="Lorem ipsum"
          isActive={true}
          onClick={() => {}}
        />
      </div>
    </StorybookMargin>
  )
}

import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { ButtonSelect } from './button-select'

export default {
  component: ButtonSelect,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ width: '300px' }}>
        <ButtonSelect
          label="Lorem ipsum"
          current_value="Lorem ipsum"
          on_click={() => {}}
        />
        <StorybookSpacer />
        <ButtonSelect
          label="Lorem ipsum"
          current_value="Lorem ipsum"
          is_active={true}
          on_click={() => {}}
        />
      </div>
    </StorybookMargin>
  )
}

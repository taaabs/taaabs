import { Helpers } from '@web-ui'
import { ButtonSelect } from './button-select'

export default {
  component: ButtonSelect,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <div style={{ width: '300px' }}>
        <ButtonSelect
          label="Lorem ipsum"
          current_value="Lorem ipsum"
          on_click={() => {}}
        />
        <Helpers.Storybook.StorybookSpacer />
        <ButtonSelect
          label="Lorem ipsum"
          current_value="Lorem ipsum"
          is_active={true}
          on_click={() => {}}
        />
      </div>
    </Helpers.Storybook.StorybookMargin>
  )
}

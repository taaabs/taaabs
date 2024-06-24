import { StorybookMargin } from '@web-ui/helpers/storybook'
import { Dropdown } from './Dropdown'
import { StandardItem as Dropdown_StandardItem } from './standard-item'
import { Separator as Dropdown_Separator } from './separator'
import { CheckboxItem as Dropdown_CheckboxItem } from './checkbox-item'
import { Stars as Dropdown_Stars } from './stars'

export default {
  component: Dropdown,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <Dropdown>
        <Dropdown_StandardItem
          icon_variant="ARCHIVE"
          label="Lorem ipsum"
          on_click={() => {}}
        />
        <Dropdown_Separator />
        <Dropdown_CheckboxItem
          is_checked={true}
          label="Lorem"
          on_click={() => {}}
        />
        <Dropdown_Stars on_click={() => {}} no_selected={2} />
      </Dropdown>
    </StorybookMargin>
  )
}

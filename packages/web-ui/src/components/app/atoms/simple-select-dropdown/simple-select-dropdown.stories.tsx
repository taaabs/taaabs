import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { SimpleSelectDropdown } from './index'

export default {
  component: SimpleSelectDropdown,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ width: 300 }}>
        <SimpleSelectDropdown
          items={[
            { label: 'Lorem', on_click: () => {}, is_selected: false },
            { label: 'Lorem', on_click: () => {}, is_selected: true },
            { label: 'Lorem', on_click: () => {}, is_selected: false },
          ]}
          checkboxes={[
            {
              label: 'Lorem',
              on_click: () => {},
              is_selected: true,
            },
            {
              label: 'Lorem',
              on_click: () => {},
              is_selected: false,
              is_disabled: true,
            },
          ]}
        />
      </div>
    </StorybookMargin>
  )
}

import { StorybookMargin } from '@web-ui/helpers/storybook'
import { DropdownMenu } from './index'

export default {
  component: DropdownMenu,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ width: 300 }}>
        <DropdownMenu
          items={[
            { label: 'Lorem', on_click: () => {}, is_selected: false },
            { label: 'Lorem', on_click: () => {}, is_selected: true },
            { label: 'Lorem', on_click: () => {}, is_selected: false },
          ]}
        />
      </div>
    </StorybookMargin>
  )
}

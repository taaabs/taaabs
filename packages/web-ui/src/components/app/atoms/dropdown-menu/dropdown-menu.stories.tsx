import { Helpers } from '@web-ui'
import { DropdownMenu } from './index'

export default {
  component: DropdownMenu,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <div style={{ width: 300 }}>
        <DropdownMenu
          items={[
            { label: 'Lorem', on_click: () => {}, is_selected: false },
            { label: 'Lorem', on_click: () => {}, is_selected: true },
            { label: 'Lorem', on_click: () => {}, is_selected: false },
          ]}
        />
      </div>
    </Helpers.Storybook.StorybookMargin>
  )
}

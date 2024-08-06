import { StorybookMargin } from '@web-ui/helpers/storybook'
import { Toolbar } from './Toolbar'

export default {
  component: Toolbar,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ display: 'flex' }}>
        <Toolbar
          toggleable_buttons={[
            {
              label: 'Lorem',
              is_toggled: false,
              on_click: () => {},
            },
            {
              label: 'Lorem',
              is_toggled: true,
              on_click: () => {},
            },
            {
              label: 'Lorem',
              is_toggled: false,
              on_click: () => {},
            },
          ]}
        />
      </div>
    </StorybookMargin>
  )
}
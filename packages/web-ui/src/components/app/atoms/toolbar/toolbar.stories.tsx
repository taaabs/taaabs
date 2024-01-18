import { StorybookMargin } from '@web-ui/helpers/storybook'
import { Toolbar } from './toolbar'

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
          icon_buttons={[
            {
              icon_variant: 'DENSITY_DEFAULT',
              on_click: () => {},
            },
            {
              icon_variant: 'MORE',
              on_click: () => {},
            },
          ]}
        />
      </div>
    </StorybookMargin>
  )
}

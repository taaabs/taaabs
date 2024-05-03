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
          toggleable_buttons_={[
            {
              label_: 'Lorem',
              is_toggled_: false,
              on_click_: () => {},
            },
            {
              label_: 'Lorem',
              is_toggled_: true,
              on_click_: () => {},
            },
            {
              label_: 'Lorem',
              is_toggled_: false,
              on_click_: () => {},
            },
          ]}
          icon_buttons_={[
            {
              icon_variant_: 'DENSITY_DEFAULT',
              on_click: () => {},
            },
            {
              icon_variant_: 'MORE',
              on_click: () => {},
            },
          ]}
        />
      </div>
    </StorybookMargin>
  )
}

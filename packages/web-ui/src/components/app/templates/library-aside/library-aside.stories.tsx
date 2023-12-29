import { StorybookSpacer } from '@web-ui/helpers/storybook'
import { LibraryAside } from './library-aside'

export default {
  component: LibraryAside,
}

export const Primary = () => {
  return (
    <>
      <LibraryAside
        slot_presets={<>[presets]</>}
        slot_filter={{
          button: <>[filter]</>,
          dropdown: <></>,
          is_dropdown_visible: false,
        }}
        slot_sortby={{
          button: <>[sortby]</>,
          dropdown: <></>,
          is_dropdown_visible: false,
        }}
        slot_order={{
          button: <>[order]</>,
          dropdown: <></>,
          is_dropdown_visible: false,
        }}
        slot_custom_range={<>[custom range]</>}
        slot_tags={<>[tags]</>}
      />
      <StorybookSpacer />
      <LibraryAside
        slot_presets={<>[presets]</>}
        slot_filter={{
          button: <>[filter]</>,
          dropdown: <>[dropdown]</>,
          is_dropdown_visible: true,
        }}
        slot_sortby={{
          button: <>[sortby]</>,
          dropdown: <>[dropdown]</>,
          is_dropdown_visible: true,
        }}
        slot_order={{
          button: <>[order]</>,
          dropdown: <>[dropdown]</>,
          is_dropdown_visible: true,
        }}
        slot_custom_range={<>[custom range]</>}
        slot_tags={<>[tags]</>}
      />
    </>
  )
}

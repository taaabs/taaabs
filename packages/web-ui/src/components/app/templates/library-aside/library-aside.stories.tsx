import { StorybookSpacer } from '@web-ui/helpers/storybook'
import { LibraryAside } from './library-aside'

export default {
  component: LibraryAside,
}

export const Primary = () => {
  return (
    <>
      <LibraryAside
        support_href={() => {}}
        support_label="Give feedback"
        slot_sort_by={{
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
        support_href={() => {}}
        support_label="Give feedback"
        slot_sort_by={{
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

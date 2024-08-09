import { StorybookSpacer } from '@web-ui/helpers/storybook'
import { LibraryAside } from './LibraryAside'

export default {
  component: LibraryAside,
}

export const Primary = () => {
  return (
    <>
      <LibraryAside
        support_href="https://example.com/support"
        support_label="Give feedback"
        slot_segmented_buttons={<>[segmented buttons]</>}
        slot_custom_range={<>[custom range]</>}
        slot_tags={<>[tags]</>}
      />
      <StorybookSpacer />
      <LibraryAside
        support_href="https://example.com/support"
        support_label="Give feedback"
        slot_segmented_buttons={<>[segmented buttons]</>}
        slot_custom_range={<>[custom range]</>}
        slot_tags={<>[tags]</>}
      />
    </>
  )
}

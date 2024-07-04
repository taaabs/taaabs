import { ContentReader as UiCommonTemplate_Modal_ContentReader } from '@web-ui/components/common/modal/content-reader'
import { Modal } from '@web-ui/components/common/modal'
import { lorem_ipsum } from '@web-ui/helpers'

export default {
  title: 'page-previews/reader-modal',
}

export const Reader = () => (
  <Modal
    children={<>{lorem_ipsum.long}</>}
    content={
      <UiCommonTemplate_Modal_ContentReader
        slot_left_panel="left"
        slot_right_panel="right"
        children={lorem_ipsum.long}
      />
    }
    on_outside_click={() => {}}
  />
)

import { Dictionary } from '@/dictionaries/dictionary'
import { Header as UiCommonTemplate_Modal_ContentStandard_Header } from '@web-ui/components/common/templates/modal/content-standard/header'
import { Footer as UiCommonTemplate_Modal_ContentStandard_Footer } from '@web-ui/components/common/templates/modal/content-standard/footer'
import { Delete as UiCommonTemplate_Modal_ContentStandard_Delete } from '@web-ui/components/common/templates/modal/content-standard/delete'
import { useContext, useRef, useState } from 'react'
import {
  Content,
  Footer,
  Header,
  Portal,
  Sheet,
  detents,
} from 'react-sheet-slide'
import { ModalContext } from '@/providers/modal-provider'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

namespace DeleteBookmarkModal {
  export type Props = {
    title?: string
    on_submit: () => void
    on_close: () => void
    dictionary: Dictionary
  }
}

export const DeleteBookmarkModal: React.FC<DeleteBookmarkModal.Props> = (
  props,
) => {
  const [is_open, set_is_open] = useState(true)
  const ref = useRef(null)
  const modal_context = useContext(ModalContext)!
  const [is_deleting, set_is_deleting] = useState<boolean>()

  useUpdateEffect(() => {
    set_is_open(false)
  }, [modal_context.close_trigger])

  const content = (
    <UiCommonTemplate_Modal_ContentStandard_Delete
      text={props.dictionary.app.delete_modal.are_you_sure}
      bookmark_title={props.title}
    />
  )

  const header = (
    <UiCommonTemplate_Modal_ContentStandard_Header
      title={props.dictionary.app.delete_modal.delete_bookmark}
    />
  )

  const footer = (
    <UiCommonTemplate_Modal_ContentStandard_Footer
      button_label={props.dictionary.app.delete_modal.delete}
      is_disabled={is_deleting}
      button_on_click={() => {
        set_is_deleting(true)
        props.on_submit()
      }}
      on_click_cancel={props.on_close}
      is_danger={true}
      translations={{
        cancel: props.dictionary.app.delete_modal.cancel,
      }}
    />
  )

  return (
    <Portal>
      <div
        style={
          {
            '--modal-width': '300px',
          } as any
        }
      >
        <Sheet
          ref={ref}
          open={is_open}
          onDismiss={() => {
            props.on_close()
          }}
          onClose={() => {
            // props.on_close()
            // console.log('2')
          }}
          selectedDetent={detents.fit}
          scrollingExpands={true}
          useDarkMode={false}
        >
          <Header>{header}</Header>
          <Content>{content}</Content>
          <Footer>{footer}</Footer>
        </Sheet>
      </div>
    </Portal>
  )
}

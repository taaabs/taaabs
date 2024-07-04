import { Dictionary } from '@/dictionaries/dictionary'
import { Header as UiModal_Header } from '@web-ui/components/modal/Header'
import { Footer as UiModal_Footer } from '@web-ui/components/modal/Footer'
import { Content as UiModal_Content } from '@web-ui/components/modal/Content'
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

namespace DeleteAccountModal {
  export type Props = {
    on_submit: () => void
    on_close: () => void
    dictionary: Dictionary
  }
}

export const DeleteAccountModal: React.FC<DeleteAccountModal.Props> = (
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
    <UiModal_Content>
      {props.dictionary.settings.general.delete_account.modal.text}
    </UiModal_Content>
  )

  const header = (
    <UiModal_Header
      title={props.dictionary.settings.general.delete_account.modal.header}
      on_close_click={props.on_close}
    />
  )

  const footer = (
    <UiModal_Footer
      button_label={
        props.dictionary.settings.general.delete_account.modal.button_label
      }
      is_disabled={is_deleting}
      button_on_click={() => {
        set_is_deleting(true)
        props.on_submit()
      }}
      on_click_cancel={props.on_close}
      is_danger={true}
      translations={{
        cancel: props.dictionary.settings.general.delete_account.modal.cancel,
      }}
    />
  )

  return (
    <Portal>
      <div
        style={
          {
            '--modal-width': '400px',
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

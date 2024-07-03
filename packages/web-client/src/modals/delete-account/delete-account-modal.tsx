import { Dictionary } from '@/dictionaries/dictionary'
import { Header as UiCommonTemplate_Modal_ContentStandard_Header } from '@web-ui/components/common/templates/modal/content-standard/header'
import { Footer as UiCommonTemplate_Modal_ContentStandard_Footer } from '@web-ui/components/common/templates/modal/content-standard/footer'
import { ContentStandard as UiCommonTemplate_Modal_ContentStandard } from '@web-ui/components/common/templates/modal/content-standard'
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
    <UiCommonTemplate_Modal_ContentStandard>
      {props.dictionary.settings.general.delete_account.modal.text}
    </UiCommonTemplate_Modal_ContentStandard>
  )

  const header = (
    <UiCommonTemplate_Modal_ContentStandard_Header
      title={props.dictionary.settings.general.delete_account.modal.header}
    />
  )

  const footer = (
    <UiCommonTemplate_Modal_ContentStandard_Footer
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

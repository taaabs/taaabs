import { FormModal as UiAppTemplate_FormModal } from '../../../web-ui/src/components/app/templates/form-modal'
import { ModalHeader as UiAppAtom_ModalHeader } from '../../../web-ui/src/components/app/atoms/modal-header'
import { ModalFooter as UiAppAtom_ModalFooter } from '../../../web-ui/src/components/app/atoms/modal-footer'
import { useContext, useEffect } from 'react'
import { GlobalLibarySearchContext } from '@/app/global-library-search-provider'

export namespace FindTag {
  export type Tag = {
    name: string
    is_public?: boolean
  }
  export type Props = {
    button_label: string
    title: string
    on_submit: (tag: Tag) => void
    on_close: () => void
  }
}

export const FindTag: React.FC<FindTag.Props> = (props) => {
  const global_library_search = useContext(GlobalLibarySearchContext)
  useEffect(() => {
    // counts tags
  }, [])
  return (
    <UiAppTemplate_FormModal
      slot_header={<UiAppAtom_ModalHeader title={props.title} />}
      slot_footer={
        <UiAppAtom_ModalFooter
          button_label={props.button_label}
          on_click_cancel={props.on_close}
          is_disabled={false}
          button_on_click={() => {
            props.on_submit({ name: 'test' })
          }}
        />
      }
    >
      x
    </UiAppTemplate_FormModal>
  )
}

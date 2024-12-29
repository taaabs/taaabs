import { Dictionary } from '@/dictionaries/dictionary'
import { Modal as Ui_Modal } from '@web-ui/components/Modal'
import { Header as Ui_Modal_Header } from '@web-ui/components/Modal/Header'
import { Footer as Ui_Modal_Footer } from '@web-ui/components/Modal/Footer'
import { Content as Ui_Modal_Content } from '@web-ui/components/Modal/Content'
import { useContext } from 'react'
import { ModalContext } from '@/providers/ModalProvider'
import { AuthContext } from '@/providers/AuthProvider'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
import { Input as UiInput } from '@web-ui/components/Input'
import { system_values } from '@shared/constants/system-values'

namespace RenameTagModal {
  export type Props = {
    name: string
    on_submit: (name: string) => void
    on_close: () => void
    dictionary: Dictionary
  }
}

type FormValues = {
  name: string
}

export const RenameTagModal: React.FC<RenameTagModal.Props> = (props) => {
  const modal_context = useContext(ModalContext)
  const auth_context = useContext(AuthContext)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'onBlur' })

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const tags_data_source = new Tags_DataSourceImpl(auth_context.ky_instance)
    const tags_repository = new Tags_RepositoryImpl(tags_data_source)
    try {
      await tags_repository.rename(
        {
          old_name: props.name,
          new_name: form_data.name,
        },
        auth_context.auth_data!.encryption_key,
      )
    } catch (e) {
      throw e
    }
    props.on_submit(form_data.name)
  }

  const content = (
    <Ui_Modal_Content>
      <Controller
        name="name"
        control={control}
        defaultValue={props.name}
        rules={{
          minLength: {
            value: 1,
            message: props.dictionary.app.rename_tag_modal.tag_is_too_short,
          },
          maxLength: {
            value: system_values.bookmark.tags.max_length,
            message: props.dictionary.app.rename_tag_modal.tag_is_too_long,
          },
        }}
        render={({ field }) => {
          const error_message = errors.name?.message
          return (
            <UiInput
              value={field.value}
              on_change={(value) => {
                if (!isSubmitting) {
                  field.onChange(value)
                }
              }}
              message_type={error_message ? 'error' : undefined}
              message={error_message}
              min_lines={1}
            />
          )
        }}
      />
    </Ui_Modal_Content>
  )

  const header = (
    <Ui_Modal_Header
      title={props.dictionary.app.rename_tag_modal.rename_tag}
      on_close={props.on_close}
    />
  )

  const footer = (
    <Ui_Modal_Footer
      button_label={props.dictionary.app.rename_tag_modal.rename}
      is_disabled={isSubmitting || (isSubmitted && isSubmitSuccessful)}
      button_on_click={handleSubmit(on_submit)}
      on_click_cancel={props.on_close}
      translations={{
        cancel: props.dictionary.app.rename_tag_modal.cancel,
      }}
    />
  )

  return (
    <Ui_Modal
      is_open={modal_context.is_open}
      is_dismissible={!(isSubmitting || (isSubmitted && isSubmitSuccessful))}
      on_close={props.on_close}
      width={400}
      slot_header={header}
      slot_content={content}
      slot_footer={footer}
    />
  )
}

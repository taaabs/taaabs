import { Dictionary } from '@/dictionaries/dictionary'
import { Content as UiCommonTemplate_Modal_Content } from '@web-ui/components/common/templates/modal/content'
import { Header as UiCommonTemplate_Modal_Content_Header } from '@web-ui/components/common/templates/modal/content/header'
import { Footer as UiCommonTemplate_Modal_Content_Footer } from '@web-ui/components/common/templates/modal/content/footer'
import { useContext } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { AuthContext } from '@/app/auth-provider'
import { system_values } from '@shared/constants/system-values'

export const rename_tag_modal = (params: {
  modal_context: any
  old_tag_name: string
  dictionary: Dictionary
}) =>
  new Promise<string | null>((resolve) => {
    const on_submit_handler = (name: string) => resolve(name)
    const on_close_handler = () => resolve(null)
    params.modal_context.set_modal({
      modal: (
        <_Modal
          on_submit={on_submit_handler}
          on_close={on_close_handler}
          dictionary={params.dictionary}
          old_tag_name={params.old_tag_name}
        />
      ),
    })
  })

type FormValues = {
  name: string
}

const _Modal: React.FC<{
  old_tag_name: string
  on_submit: (name: string) => void
  on_close: () => void
  dictionary: Dictionary
}> = (props) => {
  const auth_context = useContext(AuthContext)!
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: 'onBlur' })

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const tags_data_source = new Tags_DataSourceImpl(auth_context.ky_instance)
    const tags_repository = new Tags_RepositoryImpl(tags_data_source)
    try {
      await tags_repository.rename(
        {
          old_tag_name: props.old_tag_name,
          new_tag_name: form_data.name,
        },
        auth_context.auth_data!.encryption_key,
      )
    } catch (e) {
      throw e
    }
    props.on_submit(form_data.name)
  }

  return (
    <UiCommonTemplate_Modal_Content
      width={400}
      slot_header={
        <UiCommonTemplate_Modal_Content_Header
          title={props.dictionary.app.rename_tag_modal.rename_tag}
        />
      }
      slot_footer={
        <UiCommonTemplate_Modal_Content_Footer
          button_label={props.dictionary.app.rename_tag_modal.rename}
          is_disabled={isSubmitting}
          button_on_click={handleSubmit(on_submit)}
          on_click_cancel={props.on_close}
          translations={{
            cancel: props.dictionary.app.rename_tag_modal.cancel,
          }}
        />
      }
    >
      <Controller
        name="name"
        control={control}
        defaultValue={props.old_tag_name}
        rules={{
          maxLength: system_values.bookmark.tags.max_length,
        }}
        render={({ field }) => {
          let error_message: string | undefined

          if (errors.name?.type == 'maxLength') {
            error_message =
              props.dictionary.app.rename_tag_modal.tag_is_too_long
          }

          return (
            <UiCommonAtom_Input
              value={field.value}
              on_change={(value) => {
                if (!isSubmitting) {
                  field.onChange(value)
                }
              }}
              message_type={error_message ? 'error' : undefined}
              message={error_message}
              lines={1}
            />
          )
        }}
      />
    </UiCommonTemplate_Modal_Content>
  )
}
import { Dictionary } from '@/dictionaries/dictionary'
import { ContentStandard as UiCommonTemplate_Modal_ContentStandard } from '@web-ui/components/common/templates/modal/content-standard'
import { Header as UiCommonTemplate_Modal_ContentStandard_Header } from '@web-ui/components/common/templates/modal/content-standard/header'
import { Footer as UiCommonTemplate_Modal_ContentStandard_Footer } from '@web-ui/components/common/templates/modal/content-standard/footer'
import { useContext } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { AuthContext } from '@/app/auth-provider'
import { system_values } from '@shared/constants/system-values'

export const rename_tag_modal_setter = (params: {
  modal_context: any
  old_tag_name: string
  dictionary: Dictionary
}) =>
  new Promise<string | null>((resolve) => {
    const on_submit_handler = (name: string) => resolve(name)
    const on_close_handler = () => resolve(null)
    params.modal_context.set_content({
      content: (
        <_ModalContent
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

const _ModalContent: React.FC<{
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
    <UiCommonTemplate_Modal_ContentStandard
      width={350}
      slot_header={
        <UiCommonTemplate_Modal_ContentStandard_Header
          title={props.dictionary.app.rename_tag_modal.rename_tag}
        />
      }
      slot_footer={
        <UiCommonTemplate_Modal_ContentStandard_Footer
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
    </UiCommonTemplate_Modal_ContentStandard>
  )
}

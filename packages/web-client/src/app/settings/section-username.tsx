import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import awesomeDebouncePromise from 'awesome-debounce-promise'
import { Settings_DataSourceImpl } from '@repositories/modules/settings/infrastructure/data-sources/settings.data-source-impl'
import { Settings_RepositoryImpl } from '@repositories/modules/settings/infrastructure/repositories/settings.repository-impl'
import { HeadingWithSubheading as UiAppAtom_HeadingWithSubheading } from '@web-ui/components/app/atoms/heading-with-subheading'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { system_values } from '@shared/constants/system-values'
import { AuthContext } from '@/app/auth-provider'
import { Dictionary } from '@/dictionaries/dictionary'
import { Miscellaneous_DataSourceImpl } from '@repositories/modules/miscellaneous/infrastructure/miscellaneous.data-source-impl'
import { Miscellaneous_RepositoryImpl } from '@repositories/modules/miscellaneous/infrastructure/miscellaneous.repository-impl'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

type FormValues = {
  username: string
}

export const SectionUsername: React.FC<{ dictionary: Dictionary }> = (
  props,
) => {
  const auth_context = useContext(AuthContext)!
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    resetField,
  } = useForm<FormValues>({
    mode: 'all',
  })

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    if (form_data.username == auth_context.auth_data!.username) {
      toast.success(
        props.dictionary.settings.general.username.username_left_unchanged,
      )
      return
    }
    const data_source = new Settings_DataSourceImpl(auth_context.ky_instance)
    const repository = new Settings_RepositoryImpl(data_source)
    await repository.update_username({ username: form_data.username })
    auth_context.set_auth_data({
      ...auth_context.auth_data!,
      username: form_data.username,
    })
    toast.success(props.dictionary.settings.general.username.username_changed)
  }

  const get_is_username_available = async (username: string) => {
    if (username == auth_context.auth_data!.username) return true
    const data_source = new Miscellaneous_DataSourceImpl(
      auth_context.ky_instance,
    )
    const repository = new Miscellaneous_RepositoryImpl(data_source)
    const result = await repository.check_username_availability({
      username,
    })
    if (result.is_available) {
      return true
    } else {
      return props.dictionary.settings.general.username.username_not_available
    }
  }

  useUpdateEffect(() => {
    setValue('username', auth_context.auth_data!.username)
  }, [auth_context.auth_data])

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <UiAppAtom_HeadingWithSubheading
        heading={props.dictionary.settings.general.username.heading.text}
        subheading={props.dictionary.settings.general.username.heading.subtext}
      />

      <Controller
        name="username"
        control={control}
        defaultValue={auth_context.auth_data?.username || ''}
        rules={{
          required: {
            value: true,
            message: props.dictionary.auth.field_is_required,
          },
          maxLength: {
            value: system_values.username_max_length,
            message: props.dictionary.auth.sign_up.username_too_long,
          },
          minLength: {
            value: system_values.username_min_length,
            message: props.dictionary.auth.sign_up.username_too_short,
          },
          pattern: {
            value: system_values.username_regex,
            message:
              props.dictionary.auth.sign_up
                .username_contains_incorrect_characters,
          },
          validate: awesomeDebouncePromise(async (value) => {
            return await get_is_username_available(value)
          }, 500),
        }}
        render={({ field }) => {
          const error_message = errors.username?.message
          return (
            <UiCommonAtom_Input
              value={field.value}
              on_change={(value) => {
                if (isSubmitting) return
                resetField('username')
                field.onChange(value)
              }}
              message_type={error_message ? 'error' : undefined}
              message={
                error_message ? (
                  error_message
                ) : (
                  <span>
                    taaabs.com/
                    <strong>{field.value}</strong>
                  </span>
                )
              }
              is_disabled={!auth_context.auth_data}
            />
          )
        }}
      />
      <br />
      <UiCommonParticle_Button
        type="submit"
        is_disabled={isSubmitting || !auth_context.auth_data}
      >
        {props.dictionary.settings.general.username.change_username}
      </UiCommonParticle_Button>
    </form>
  )
}

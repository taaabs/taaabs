import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import awesomeDebouncePromise from 'awesome-debounce-promise'
import { Settings_DataSourceImpl } from '@repositories/modules/settings/infrastructure/data-sources/settings.data-source-impl'
import { Settings_RepositoryImpl } from '@repositories/modules/settings/infrastructure/repositories/settings.repository-impl'
import { CheckUsernameAvailability_UseCase } from '@repositories/modules/settings/domain/use-cases/check-username-availability.use-case'
import { UpdateUsername_UseCase } from '@repositories/modules/settings/domain/use-cases/update-username.use-case'
import { HeadingWithSubheading as UiAppAtom_HeadingWithSubheading } from '@web-ui/components/app/atoms/heading-with-subheading'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { system_values } from '@shared/constants/system-values'
import { AuthContext } from '@/app/auth-provider'

type FormValues = {
  username: string
}

export const SectionUsername: React.FC = () => {
  const auth_context = useContext(AuthContext)!
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'all',
  })

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    if (form_data.username == auth_context.auth_data!.username) {
      toast.success('Your username is left unchanged')
      return
    }
    const data_source = new Settings_DataSourceImpl(auth_context.ky_instance)
    const repository = new Settings_RepositoryImpl(data_source)
    const update_username_use_case = new UpdateUsername_UseCase(repository)
    await update_username_use_case.invoke({ username: form_data.username })
    auth_context.set_auth_data({
      ...auth_context.auth_data!,
      username: form_data.username,
    })
    toast.success('Username has been changed')
  }

  const get_is_username_available = async (username: string) => {
    const data_source = new Settings_DataSourceImpl(auth_context.ky_instance)
    const repository = new Settings_RepositoryImpl(data_source)
    const check_username_availability_use_case =
      new CheckUsernameAvailability_UseCase(repository)
    const is_available = (
      await check_username_availability_use_case.invoke({
        username,
      })
    ).is_available
    return is_available
  }

  return (
    <form
      onSubmit={handleSubmit(on_submit)}
      key={auth_context.auth_data?.username}
    >
      <UiAppAtom_HeadingWithSubheading
        heading="Username"
        subheading="Accessing your account and sharing your public profile requires using unique username."
      />

      <Controller
        name="username"
        control={control}
        defaultValue={auth_context.auth_data?.username}
        rules={{
          required: true,
          minLength: system_values.username_min_length,
          maxLength: system_values.username_max_length,
          pattern: /^[a-z0-9\-\_]+$/,
          validate: awesomeDebouncePromise(async (value) => {
            if (value == auth_context.auth_data!.username) return true
            return await get_is_username_available(value)
          }, 500),
        }}
        render={({ field }) => {
          let error_message: string | undefined

          const info_message = (
            <>
              taaabs.com/<strong>{field.value}</strong>
            </>
          )

          if (errors.username?.type == 'minLength') {
            error_message = `Username must have at least ${system_values.username_min_length} characters.`
          } else if (errors.username?.type == 'maxLength') {
            error_message = `Maximum length of a username is ${system_values.username_max_length} characters.`
          } else if (errors.username?.type == 'pattern') {
            error_message =
              'Only lowercase letters, numbers, periods, and underscores are allowed.'
          } else if (errors.username?.type == 'validate') {
            error_message = 'This username is already in use.'
          }

          return (
            <UiCommonAtom_Input
              value={field.value}
              on_change={(value) => {
                if (isSubmitting) return

                field.onChange(value)
              }}
              message_type={error_message ? 'error' : undefined}
              message={error_message || info_message}
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
        Save
      </UiCommonParticle_Button>
    </form>
  )
}

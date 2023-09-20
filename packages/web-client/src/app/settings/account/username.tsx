import { Input } from '@web-ui/components/common/atoms/input'
import { Button } from '@web-ui/components/common/particles/button'
import { SettingBox } from '@web-ui/components/settings/atoms/setting-box'
import { SettingHeading } from '@web-ui/components/settings/atoms/setting-heading'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import { Settings_DataSourceImpl } from '@repositories/modules/settings/infrastructure/data-sources/settings.data-source-impl'
import { Settings_RepositoryImpl } from '@repositories/modules/settings/infrastructure/repositories/settings.repository-impl'
import { CheckUsernameAvailability_UseCase } from '@repositories/modules/settings/domain/use-cases/check-username-availability.use-case'
import { UpdateUsername_UseCase } from '@repositories/modules/settings/domain/use-cases/update-username.use-case'

type FormValues = {
  username: string
}

export namespace Username {
  export type Props = {
    my_username: string
  }
}

export const Username: React.FC<Username.Props> = (props) => {
  const [is_validating, set_is_validating] = useState(false)
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onSubmit',
  })

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const data_source = new Settings_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
    )
    const repository = new Settings_RepositoryImpl(data_source)
    const update_username_use_case = new UpdateUsername_UseCase(repository)

    await update_username_use_case.invoke({ username: form_data.username })

    window.location.reload()
  }

  const trigger_validation = useDebouncedCallback(trigger, [], 500)

  const is_username_available = async (username: string) => {
    const data_source = new Settings_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
    )
    const repository = new Settings_RepositoryImpl(data_source)
    const check_username_availability_use_case =
      new CheckUsernameAvailability_UseCase(repository)

    const is_available = (
      await check_username_availability_use_case.invoke({
        username,
      })
    ).is_available

    set_is_validating(false)

    return is_available
  }

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <SettingBox>
        <SettingHeading
          heading="Username"
          subheading="The username determines the default link of your public profile."
        />

        <Controller
          name="username"
          control={control}
          defaultValue={props.my_username}
          rules={{
            required: true,
            minLength: 8,
            maxLength: 30,
            pattern: /^[A-Za-z0-9\-\_]+$/,
            validate: async (v) => await is_username_available(v),
          }}
          render={({ field }) => {
            let error_message: string | undefined
            let info_message: string | React.ReactNode

            if (is_validating) {
              info_message = 'Checking username availability...'
            } else {
              info_message = (
                <>
                  taaabs.com/<strong>{field.value}</strong>
                </>
              )

              if (errors.username?.type == 'minLength') {
                error_message = 'Username must have at least 8 characters'
              } else if (errors.username?.type == 'maxLength') {
                error_message = 'Maximum length of a username is 30 characters'
              } else if (errors.username?.type == 'pattern') {
                error_message =
                  'Only letters, numbers, periods, and underscores are allowed'
              } else if (errors.username?.type == 'validate') {
                error_message = 'This username is already in use'
              }
            }

            return (
              <Input
                value={field.value}
                on_change={(e) => {
                  if (isSubmitting) return
                  set_is_validating(true)
                  trigger_validation()
                  field.onChange(e)
                }}
                message_type={error_message ? 'error' : undefined}
                message={error_message || info_message}
              />
            )
          }}
        />
        <Button size="default" type="submit" is_loading={isSubmitting}>
          Save
        </Button>
      </SettingBox>
    </form>
  )
}

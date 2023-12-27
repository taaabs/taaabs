import { Ui } from '@web-ui'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import awesomeDebouncePromise from 'awesome-debounce-promise'
import { Settings_DataSourceImpl } from '@repositories/modules/settings/infrastructure/data-sources/settings.data-source-impl'
import { Settings_RepositoryImpl } from '@repositories/modules/settings/infrastructure/repositories/settings.repository-impl'
import { CheckUsernameAvailability_UseCase } from '@repositories/modules/settings/domain/use-cases/check-username-availability.use-case'
import { UpdateUsername_UseCase } from '@repositories/modules/settings/domain/use-cases/update-username.use-case'

type FormValues = {
  username: string
}

export namespace Username {
  export type Props = {
    current_username: string
  }
}

export const Username: React.FC<Username.Props> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'all',
  })

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const data_source = new Settings_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
    )
    const repository = new Settings_RepositoryImpl(data_source)
    const update_username_use_case = new UpdateUsername_UseCase(repository)

    await update_username_use_case.invoke({ username: form_data.username })
  }

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

    return is_available
  }

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading
          heading="Username"
          subheading="The username determines the default link of your public profile."
        />

        <Controller
          name="username"
          control={control}
          defaultValue={props.current_username}
          rules={{
            required: true,
            minLength: 8,
            maxLength: 30,
            pattern: /^[a-z0-9\-\_]+$/,
            validate: awesomeDebouncePromise(async (value) => {
              return await is_username_available(value)
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
              error_message = 'Username must have at least 8 characters'
            } else if (errors.username?.type == 'maxLength') {
              error_message = 'Maximum length of a username is 30 characters'
            } else if (errors.username?.type == 'pattern') {
              error_message =
                'Only lowercase letters, numbers, periods, and underscores are allowed'
            } else if (errors.username?.type == 'validate') {
              error_message = 'This username is already in use'
            }

            return (
              <Ui.Common.Atoms.Input
                value={field.value}
                on_change={(value) => {
                  if (isSubmitting) return

                  field.onChange(value)
                }}
                message_type={error_message ? 'error' : undefined}
                message={error_message || info_message}
              />
            )
          }}
        />
        <div>
          <Ui.Common.Particles.Button
            size="default"
            type="submit"
            is_loading={isSubmitting}
          >
            Save
          </Ui.Common.Particles.Button>
        </div>
      </Ui.App.Atoms.Box>
    </form>
  )
}

'use client'

import { Auth as UiAuthTemplate_Auth } from '@web-ui/components/auth/templates/auth'
import { Dictionary } from '@/dictionaries/dictionary'
import { LogInForm as UiAuthTemplate_LogInForm } from '@web-ui/components/auth/templates/log-in-form'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { is_object_empty } from '@shared/utils/is-object-empty'
import { LogIn_Params } from '@repositories/modules/auth/domain/log-in.params'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import ky from 'ky'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import { toast } from 'react-toastify'
import { useContext, useState } from 'react'
import { AuthContext } from '@/app/auth-provider'
import { Crypto } from '@repositories/utils/crypto'

type FormValues = {
  email: string
  password: string
}

export const LogIn = (props: { dictionary: Dictionary }) => {
  const auth_context = useContext(AuthContext)
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const [will_redirect, set_will_redirect] = useState<boolean>()

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const params: LogIn_Params = {
      email: form_data.email,
      password: form_data.password,
    }
    const ky_instance = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data_source = new Auth_DataSourceImpl(ky_instance)
    const repository = new Auth_RepositoryImpl(data_source)
    try {
      const result = await repository.log_in(params)
      auth_context!.set_auth_data({
        id: result.id,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        username: result.username,
        encryption_key: await Crypto.derive_encrypton_key(
          form_data.password,
          result.id,
        ),
      })
      set_will_redirect(true)
      document.location = '/library'
    } catch (e) {
      toast.error(props.dictionary.auth.log_in.invalid_email_or_password)
    }
  }

  return (
    <UiAuthTemplate_Auth
      logo_href={'/'}
      heading={{
        text: props.dictionary.auth.log_in.heading.text,
        subtext: props.dictionary.auth.log_in.heading.subtext,
      }}
      switch_form={{
        text: props.dictionary.auth.log_in.switch_form.text,
        link_label: props.dictionary.auth.log_in.switch_form.link_label,
        link_href: '/signup',
      }}
    >
      <form onSubmit={handleSubmit(on_submit)} noValidate={true}>
        <UiAuthTemplate_LogInForm
          slot_email_field={
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: props.dictionary.auth.field_is_required,
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: props.dictionary.auth.invalid_email,
                },
              }}
              render={({ field }) => {
                const error_message = errors.email?.message
                return (
                  <UiCommonAtom_Input
                    value={field.value}
                    on_change={(value) => {
                      resetField('email')
                      if (!isSubmitting) {
                        field.onChange(value)
                      }
                    }}
                    on_blur={field.onBlur}
                    placeholder={props.dictionary.auth.log_in.email_address}
                    message_type={error_message ? 'error' : undefined}
                    message={error_message}
                    additional_properties={{
                      type: 'email',
                      name: 'username',
                    }}
                  />
                )
              }}
            />
          }
          slot_password_field={
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: props.dictionary.auth.field_is_required,
                },
              }}
              render={({ field }) => {
                const error_message = errors.password?.message
                return (
                  <UiCommonAtom_Input
                    value={field.value}
                    on_change={(value) => {
                      resetField('password')
                      if (!isSubmitting) {
                        field.onChange(value)
                      }
                    }}
                    on_blur={field.onBlur}
                    placeholder={props.dictionary.auth.log_in.password}
                    message_type={error_message ? 'error' : undefined}
                    message={error_message}
                    additional_properties={{
                      type: 'password',
                    }}
                  />
                )
              }}
            />
          }
          slot_submit_button={
            <UiCommonParticle_Button
              type="submit"
              is_disabled={
                !is_object_empty(errors) || isSubmitting || will_redirect
              }
            >
              {props.dictionary.auth.log_in.log_in}
            </UiCommonParticle_Button>
          }
          on_forgot_password_click={() => {}}
          translations={{
            forgot_password: props.dictionary.auth.log_in.forgot_password,
          }}
        />
      </form>
    </UiAuthTemplate_Auth>
  )
}

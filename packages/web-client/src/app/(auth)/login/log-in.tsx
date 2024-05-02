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
import { useContext } from 'react'
import { AuthContext } from '@/app/auth-provider'
import { useRouter } from 'next/navigation'

type FormValues = {
  email: string
  password: string
}

export const LogIn = (params: { dictionary: Dictionary }) => {
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const router = useRouter()
  const auth_context = useContext(AuthContext)

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
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      })
      router.push('/home')
    } catch {
      toast.error('Invalid email or password. Try again.')
    }
  }

  return (
    <UiAuthTemplate_Auth
      heading={{
        text: params.dictionary.auth.log_in.heading.text,
        subtext: params.dictionary.auth.log_in.heading.subtext,
      }}
      recaptcha_privacy_notice={
        <span>
          This site is protected by reCAPTCHA and the Google{' '}
          <a>Privacy Policy</a> and <a>Terms of Service</a> apply.
        </span>
      }
      switch_form={{
        link_label: 'Create account',
        link_href: '/signup',
        text: 'New around here?',
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
                required: { value: true, message: "Field can't be empty" },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Entered email is invalid',
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
                    placeholder={'Email address'}
                    message_type={error_message ? 'error' : undefined}
                    message={error_message}
                    additional_properties={{
                      type: 'email',
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
                  message: "Field can't be empty",
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
                    placeholder={'Password'}
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
              is_disabled={!is_object_empty(errors) || isSubmitting}
            >
              Log in
            </UiCommonParticle_Button>
          }
          on_forgot_password_click={() => {}}
          translations={{
            forgot_password: 'Forgot password?',
          }}
        />
      </form>
    </UiAuthTemplate_Auth>
  )
}

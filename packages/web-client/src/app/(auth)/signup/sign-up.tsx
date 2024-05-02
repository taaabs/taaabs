'use client'

import { Auth as UiAuthTemplate_Auth } from '@web-ui/components/auth/templates/auth'
import { Dictionary } from '@/dictionaries/dictionary'
import { SignUpForm as UiAuthTemplate_SignUpForm } from '@web-ui/components/auth/templates/sign-up-form'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { is_object_empty } from '@shared/utils/is-object-empty'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import ky from 'ky'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AuthContext } from '@/app/auth-provider'
import { useRouter } from 'next/navigation'
import { system_values } from '@shared/constants/system-values'
import { SignUp_Params } from '@repositories/modules/auth/domain/sign-up.params'

type FormValues = {
  email: string
  username: string
  password: string
  retype_password: string
  hint: string
}

export const SignUp = (params: { dictionary: Dictionary }) => {
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const router = useRouter()
  const auth_context = useContext(AuthContext)

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const params: SignUp_Params = {
      username: form_data.username,
      email: form_data.email,
      password: form_data.password,
      hint: form_data.hint,
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
      const result = await repository.sign_up(params)
      auth_context!.set_auth_data({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      })
      router.push('/home')
    } catch {
      toast.error('Something went wrong... Try again.')
    }
  }

  return (
    <UiAuthTemplate_Auth
      heading={{
        text: params.dictionary.auth.sign_up.heading.text,
        subtext: params.dictionary.auth.sign_up.heading.subtext,
      }}
      recaptcha_privacy_notice={
        <span>
          This site is protected by reCAPTCHA and the Google{' '}
          <a>Privacy Policy</a> and <a>Terms of Service</a> apply.
        </span>
      }
      switch_form={{
        link_label: 'Log in',
        link_href: '/login',
        text: 'Already have an account?',
      }}
    >
      <form onSubmit={handleSubmit(on_submit)} noValidate={true}>
        <UiAuthTemplate_SignUpForm
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
                    message={
                      error_message
                        ? error_message
                        : "You'll use your email address to log in"
                    }
                    additional_properties={{
                      type: 'email',
                    }}
                  />
                )
              }}
            />
          }
          slot_username_field={
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: "Field can't be empty" },
                maxLength: {
                  value: system_values.username_max_length,
                  message: `Username exceeds ${system_values.username_max_length}-character limit`,
                },
                minLength: {
                  value: system_values.username_min_length,
                  message: `Username must have at least ${system_values.username_min_length} characters`,
                },
              }}
              render={({ field }) => {
                const error_message = errors.username?.message
                return (
                  <UiCommonAtom_Input
                    value={field.value}
                    on_change={(value) => {
                      resetField('username')
                      if (!isSubmitting) {
                        field.onChange(value)
                      }
                    }}
                    on_blur={field.onBlur}
                    placeholder={'Username'}
                    message_type={error_message ? 'error' : undefined}
                    message={
                      error_message ? (
                        error_message
                      ) : field.value ? (
                        <span>
                          taaabs.com/
                          <strong>{field.value}</strong>
                        </span>
                      ) : (
                        'Username determines your public profile URL'
                      )
                    }
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
                minLength: {
                  value: system_values.password_min_length,
                  message: `Password must be at least ${system_values.password_min_length}-character long`,
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
                    message={
                      error_message ? (
                        error_message
                      ) : (
                        <span>
                          <strong>Important: </strong>
                          Your password encrypts all your private bookmarks and
                          can't be recovered if you forget it!
                        </span>
                      )
                    }
                    additional_properties={{
                      type: 'password',
                    }}
                  />
                )
              }}
            />
          }
          slot_retype_password_field={
            <Controller
              name="retype_password"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: "Field can't be empty",
                },
                validate: (value, { password }) =>
                  value != password
                    ? 'Password confirmation does not match'
                    : undefined,
              }}
              render={({ field }) => {
                const error_message = errors.retype_password?.message
                return (
                  <UiCommonAtom_Input
                    value={field.value}
                    on_change={(value) => {
                      resetField('retype_password')
                      if (!isSubmitting) {
                        field.onChange(value)
                      }
                    }}
                    on_blur={field.onBlur}
                    placeholder={'Retype password'}
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
          slot_password_hint_field={
            <Controller
              name="hint"
              control={control}
              defaultValue=""
              rules={{
                max: {
                  value: system_values.password_hint_max_length,
                  message: `Given hint exceeds ${system_values.password_hint_max_length}-character limit`,
                },
              }}
              render={({ field }) => {
                const error_message = errors.hint?.message
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
                    placeholder={'Password hint (optional)'}
                    message_type={error_message ? 'error' : undefined}
                    message={
                      error_message
                        ? error_message
                        : 'A password hint can help you remember your password if you forget it'
                    }
                    additional_properties={{
                      type: 'password',
                    }}
                  />
                )
              }}
            />
          }
          slot_checkbox={'CHECKBOX'}
          slot_submit_button={
            <UiCommonParticle_Button
              type="submit"
              is_disabled={!is_object_empty(errors)}
            >
              Create account
            </UiCommonParticle_Button>
          }
        />
      </form>
    </UiAuthTemplate_Auth>
  )
}

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
import { useContext, useState } from 'react'
import { AuthContext } from '@/app/auth-provider'
import { system_values } from '@shared/constants/system-values'
import { SignUp_Params } from '@repositories/modules/auth/domain/sign-up.params'
import { Crypto } from '@repositories/utils/crypto'
import { useSearchParams } from 'next/navigation'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type FormValues = {
  email: string
  username: string
  password: string
  retype_password: string
  hint: string
}

export const SignUp = (props: { dictionary: Dictionary }) => {
  const auth_context = useContext(AuthContext)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const search_params = useSearchParams()
  const [will_redirect, set_will_redirect] = useState<boolean>()

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    if (!executeRecaptcha) {
      toast.error('ReCAPTCHA is not available')
      return
    }
    const captcha_token = await executeRecaptcha('sign_up')

    const params: SignUp_Params = {
      username: form_data.username,
      email: form_data.email,
      password: form_data.password,
      hint: form_data.hint,
      captcha_token,
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
      document.location = '/'
    } catch {
      toast.error(props.dictionary.auth.something_went_wrong)
    }
  }

  return (
    <UiAuthTemplate_Auth
      logo_href="/"
      heading={{
        text: props.dictionary.auth.sign_up.heading.text,
        subtext: props.dictionary.auth.sign_up.heading.subtext,
      }}
      recaptcha_privacy_notice={props.dictionary.auth.recaptcha_privacy_notice}
      switch_form={{
        text: props.dictionary.auth.sign_up.switch_form.text,
        link_label: props.dictionary.auth.sign_up.switch_form.link_label,
        link_href: '/login',
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
                    placeholder={props.dictionary.auth.sign_up.email_address}
                    message_type={error_message ? 'error' : undefined}
                    message={
                      error_message
                        ? error_message
                        : props.dictionary.auth.sign_up.about_email_address
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
              defaultValue={search_params.get('username') || ''}
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
                    placeholder={props.dictionary.auth.sign_up.username}
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
                        props.dictionary.auth.sign_up.about_username
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
                  message: props.dictionary.auth.field_is_required,
                },
                minLength: {
                  value: system_values.password_min_length,
                  message: props.dictionary.auth.sign_up.password_too_short,
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
                    placeholder={props.dictionary.auth.sign_up.password}
                    message_type={error_message ? 'error' : undefined}
                    message={
                      error_message
                        ? error_message
                        : props.dictionary.auth.sign_up.about_password
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
                  message: props.dictionary.auth.field_is_required,
                },
                validate: (value, { password }) =>
                  value != password
                    ? props.dictionary.auth.sign_up.password_does_not_match
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
                    placeholder={props.dictionary.auth.sign_up.retype_password}
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
                maxLength: {
                  value: system_values.password_hint_max_length,
                  message: props.dictionary.auth.sign_up.hint_too_long,
                },
              }}
              render={({ field }) => {
                const error_message = errors.hint?.message
                return (
                  <UiCommonAtom_Input
                    value={field.value}
                    on_change={(value) => {
                      resetField('hint')
                      if (!isSubmitting) {
                        field.onChange(value)
                      }
                    }}
                    on_blur={field.onBlur}
                    placeholder={props.dictionary.auth.sign_up.password_hint}
                    message_type={error_message ? 'error' : undefined}
                    message={
                      error_message
                        ? error_message
                        : props.dictionary.auth.sign_up.about_password_hint
                    }
                  />
                )
              }}
            />
          }
          slot_checkbox={''}
          slot_submit_button={
            <UiCommonParticle_Button
              type="submit"
              is_disabled={!is_object_empty(errors) || will_redirect}
            >
              {props.dictionary.auth.sign_up.create_account}
            </UiCommonParticle_Button>
          }
        />
      </form>
    </UiAuthTemplate_Auth>
  )
}

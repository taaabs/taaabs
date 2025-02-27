'use client'

import { Auth as Ui_auth_templates_Auth } from '@web-ui/components/auth/templates/auth'
import { Dictionary } from '@/dictionaries/dictionary'
import { SignUpForm as UiAuthTemplate_SignUpForm } from '@web-ui/components/auth/templates/sign-up-form'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Input as UiInput } from '@web-ui/components/Input'
import { Button as UiButton } from '@web-ui/components/Button'
import { is_object_empty } from '@shared/utils/is-object-empty'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import ky from 'ky'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { AuthDataLocalStorage } from '@/providers/AuthProvider'
import { system_values } from '@shared/constants/system-values'
import { Crypto } from '@repositories/utils/crypto'
import { useSearchParams } from 'next/navigation'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Miscellaneous_DataSourceImpl } from '@repositories/modules/miscellaneous/infrastructure/miscellaneous.data-source-impl'
import { Miscellaneous_RepositoryImpl } from '@repositories/modules/miscellaneous/infrastructure/miscellaneous.repository-impl'
import awesomeDebouncePromise from 'awesome-debounce-promise'
import { SignUp_Params } from '@repositories/modules/auth/domain/types/sign-up.params'
import { browser_storage } from '@/constants/browser-storage'
import Cookies from 'js-cookie'

type FormValues = {
  email: string
  username: string
  password: string
  retype_password: string
  hint: string
}

export const SignUp = (props: { dictionary: Dictionary }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormValues>({ mode: 'onBlur' })
  const search_params = useSearchParams()
  const [will_redirect, set_will_redirect] = useState<boolean>()

  const get_is_username_available = async (username: string) => {
    const ky_instance = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data_source = new Miscellaneous_DataSourceImpl(ky_instance)
    const repository = new Miscellaneous_RepositoryImpl(data_source)
    const result = await repository.check_username_availability({ username })
    if (result.is_available) {
      return true
    } else {
      return props.dictionary.auth.sign_up.username_not_available
    }
  }

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    let captcha_token = ''
    if (process.env.NODE_ENV == 'production') {
      captcha_token = await executeRecaptcha!('sign_up')
    }

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
      const encryption_key = await Crypto.derive_encrypton_key(
        form_data.password,
        result.id,
      )
      const auth_data: AuthDataLocalStorage = {
        id: result.id,
        username: result.username,
        encryption_key: [...encryption_key],
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      }
      localStorage.setItem(
        browser_storage.local_storage.auth_data,
        JSON.stringify(auth_data),
      )
      Cookies.set('user_id', result.id, { expires: 365 })
      set_will_redirect(true)
      document.location = '/library'
    } catch {
      toast.error(props.dictionary.auth.something_went_wrong)
    }
  }

  useEffect(() => {
    if (search_params.get('username')) {
      trigger('username')
    }
  }, [])

  return (
    <Ui_auth_templates_Auth
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
                  <UiInput
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
                      name: 'username',
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
                  <UiInput
                    value={field.value}
                    on_change={(value) => {
                      if (isSubmitting) return
                      field.onChange(value)
                      if (value.length) trigger('username')
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
                  <UiInput
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
                  <UiInput
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
                  <UiInput
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
            <UiButton
              type="submit"
              is_disabled={
                !is_object_empty(errors) || isSubmitting || will_redirect
              }
            >
              {props.dictionary.auth.sign_up.create_account}
            </UiButton>
          }
        />
      </form>
    </Ui_auth_templates_Auth>
  )
}

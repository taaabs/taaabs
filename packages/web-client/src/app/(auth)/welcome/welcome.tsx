'use client'

import { Auth as Ui_auth_templates_Auth } from '@web-ui/components/auth/templates/auth'
import { browser_storage } from '@/constants/browser-storage'
import { Dictionary } from '@/dictionaries/dictionary'
import { GuestAuthDataLocalStorage } from '@/providers/AuthProvider'
import { GuestSignUp_Params } from '@repositories/modules/auth/domain/types/guest-sign-up.params'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import { Crypto } from '@repositories/utils/crypto'
import { Button as UiButton } from '@web-ui/components/Button'
import Cookies from 'js-cookie'
import ky from 'ky'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { toast } from 'react-toastify'

export const Welcome = (props: { dictionary: Dictionary }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const guest_sign_up = async () => {
    let captcha_token = ''
    if (process.env.NODE_ENV == 'production') {
      captcha_token = await executeRecaptcha!('sign_up')
    }
    const params: GuestSignUp_Params = {
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
      const { id, guest_key, access_token, refresh_token } =
        await repository.guest_sign_up(params)
      const password = Crypto.generate_strong_password()
      const encryption_key = [
        ...(await Crypto.derive_encrypton_key(password, id)),
      ]
      const guest_auth_data: GuestAuthDataLocalStorage = {
        id,
        guest_key,
        password,
        encryption_key,
        access_token: access_token,
        refresh_token: refresh_token,
      }
      localStorage.setItem(
        browser_storage.local_storage.guest_auth_data,
        JSON.stringify(guest_auth_data),
      )
      Cookies.set('guest_id', id, { expires: 365 })
      window.location.href = `${window.location.origin}/library${window.location.hash}`
    } catch {
      toast.error(props.dictionary.auth.something_went_wrong)
    }
  }

  return (
    <Ui_auth_templates_Auth
      logo_href="/"
      heading={{
        text: props.dictionary.auth.welcome.heading.text,
        subtext: props.dictionary.auth.welcome.heading.subtext,
      }}
      recaptcha_privacy_notice={props.dictionary.auth.recaptcha_privacy_notice}
    >
      <UiButton on_click={guest_sign_up}>Continue as guest</UiButton>
    </Ui_auth_templates_Auth>
  )
}

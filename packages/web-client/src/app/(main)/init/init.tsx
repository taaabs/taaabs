'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { AuthContext } from '@/providers/AuthProvider'
import { GuestSignUp_Params } from '@repositories/modules/auth/domain/types/guest-sign-up.params'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import { Crypto } from '@repositories/utils/crypto'
import { Button as UiButton } from '@web-ui/components/Button'
import { useContext, useEffect } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { toast } from 'react-toastify'

export const Init = (props: { dictionary: Dictionary }) => {
  const auth_context = useContext(AuthContext)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const guest_sign_up = async () => {
    let captcha_token = ''
    if (process.env.NODE_ENV == 'production') {
      captcha_token = await executeRecaptcha!('sign_up')
    }
    const params: GuestSignUp_Params = {
      captcha_token,
    }

    const data_source = new Auth_DataSourceImpl(auth_context.ky_instance)
    const repository = new Auth_RepositoryImpl(data_source)
    try {
      const { id, guest_token, access_token, refresh_token } =
        await repository.guest_sign_up(params)
      const encryption_key = await Crypto.derive_encrypton_key(
        Crypto.generate_strong_password(),
        id,
      )
      auth_context.set_auth_data({
        id,
        guest_token,
        encryption_key,
        access_token,
        refresh_token,
      })
    } catch {
      toast.error(props.dictionary.auth.something_went_wrong)
    }
    // redirect to /library, keep current url search params and hash
    window.location.href = `${window.location.origin}/library${window.location.hash}`
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <UiButton on_click={guest_sign_up}>Continue...</UiButton>
    </div>
  )
}

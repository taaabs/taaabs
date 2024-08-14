'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { AuthContext } from '@/providers/AuthProvider'
import { GuestSignUp_Params } from '@repositories/modules/auth/domain/types/guest-sign-up.params'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import { Crypto } from '@repositories/utils/crypto'
import ky from 'ky'
import { useContext, useEffect } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { toast } from 'react-toastify'

export const Init = (props: { dictionary: Dictionary }) => {
  const auth_context = useContext(AuthContext)
  const { executeRecaptcha } = useGoogleReCaptcha()

  useEffect(() => {
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

    guest_sign_up()
  }, [])

  return <></>
}

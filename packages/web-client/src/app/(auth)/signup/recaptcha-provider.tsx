'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export const RecaptchaProvider: React.FC<{
  children: React.ReactNode
}> = (props) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      container={{
        parameters: {},
      }}
    >
      {props.children}
    </GoogleReCaptchaProvider>
  )
}

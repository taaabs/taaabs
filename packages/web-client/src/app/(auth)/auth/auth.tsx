import { Auth as UiAuthTemplate_Auth } from '@web-ui/components/auth/templates/auth'
import { Dictionary } from '@/dictionaries/dictionary'

export const Auth = (params: { dictionary: Dictionary }) => {
  return (
    <UiAuthTemplate_Auth
      heading={{
        text: params.dictionary.auth.heading.text,
        subtext: params.dictionary.auth.heading.subtext,
      }}
      recaptcha_privacy_notice={
        <span>
          This site is protected by reCAPTCHA and the Google{' '}
          <a>Privacy Policy</a> and <a>Terms of Service</a> apply.
        </span>
      }
    >
      form
    </UiAuthTemplate_Auth>
  )
}

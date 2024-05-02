import { Auth } from './auth'

export default {
  component: Auth,
}

export const Primary = () => {
  return (
    <Auth
      heading={{ text: 'Log in', subtext: 'to continue to Taaabs' }}
      recaptcha_privacy_notice={'Lorem ipsum'}
      switch_form={{
        link_label: 'Create account',
        text: 'New around here?',
        button_on_click: () => {},
      }}
    >
      Form
    </Auth>
  )
}

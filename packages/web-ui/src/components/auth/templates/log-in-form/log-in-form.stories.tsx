import { StorybookMargin } from '@web-ui/helpers/storybook'
import { LogInForm } from './log-in-form'
import { Input } from '@web-ui/components/common/atoms/input'
import { Button } from '@web-ui/components/common/particles/button'

export default {
  component: LogInForm,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <LogInForm
        slot_email_field={
          <Input
            value={''}
            on_change={() => {}}
            placeholder={'Username or email'}
          />
        }
        slot_password_field={
          <Input value={''} on_change={() => {}} placeholder={'Password'} />
        }
        slot_submit_button={<Button type="submit">Log in</Button>}
        translations={{
          forgot_password: 'Forgot password?',
          log_in: 'Log in',
        }}
        on_forgot_password_click={() => {}}
        on_password_change={() => {}}
        on_username_change={() => {}}
        on_log_in_click={() => {}}
      />
    </StorybookMargin>
  )
}
import styles from './sign-up-form.module.scss'

export namespace SignUpForm {
  export type Props = {
    slot_email_field: React.ReactNode
    slot_username_field: React.ReactNode
    slot_password_field: React.ReactNode
    slot_retype_password_field: React.ReactNode
    slot_password_hint_field: React.ReactNode
    slot_checkbox: React.ReactNode
    slot_submit_button: React.ReactNode
  }
}

export const SignUpForm: React.FC<SignUpForm.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.slot_email_field}
      {props.slot_username_field}
      {props.slot_password_field}
      {props.slot_retype_password_field}
      {props.slot_password_hint_field}
      {props.slot_checkbox}
      <div className={styles.button}>{props.slot_submit_button}</div>
    </div>
  )
}

import styles from './log-in-form.module.scss'

export namespace LogInForm {
  export type Props = {
    slot_email_field: React.ReactNode
    slot_password_field: React.ReactNode
    slot_submit_button: React.ReactNode
    on_forgot_password_click: () => void
    translations: {
      forgot_password: string
    }
  }
}

export const LogInForm: React.FC<LogInForm.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.fields}>
        {props.slot_email_field}
        <div className={styles.fields__password}>
          {props.slot_password_field}
          <button onClick={props.on_forgot_password_click} tabIndex={-1}>
            {props.translations.forgot_password}
          </button>
        </div>
      </div>
      <div className={styles.button}>{props.slot_submit_button}</div>
    </div>
  )
}

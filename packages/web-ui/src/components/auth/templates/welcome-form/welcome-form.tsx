import styles from './welcome-form.module.scss'

export namespace WelcomeForm {
  export type Props = {
    slot_submit_button: React.ReactNode
  }
}

export const WelcomeForm: React.FC<WelcomeForm.Props> = (props) => {
  return <div className={styles.container}>{props.slot_submit_button}</div>
}

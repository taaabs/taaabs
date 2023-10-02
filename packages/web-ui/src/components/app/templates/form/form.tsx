import styles from './form.module.scss'

export namespace Form {
  export type Props = {
    slot_header: React.ReactNode
    children?: React.ReactNode
  }
}

export const Form: React.FC<Form.Props> = (props) => {
  return (
    <>
      <div className={styles.header}>{props.slot_header}</div>
      <main className={styles.main}>{props.children}</main>
    </>
  )
}

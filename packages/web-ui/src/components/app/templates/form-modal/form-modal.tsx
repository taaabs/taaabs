import styles from './form-modal.module.scss'

export namespace FormModal {
  export type Props = {
    slot_header: React.ReactNode
    children?: React.ReactNode
    slot_footer: React.ReactNode
  }
}

export const FormModal: React.FC<FormModal.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__header}>{props.slot_header}</div>
      <div className={styles.container__content}>
        <div className={styles.container__content__inner}>{props.children}</div>
      </div>
      <div className={styles.container__footer}>{props.slot_footer}</div>
    </div>
  )
}

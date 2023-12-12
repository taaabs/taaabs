import styles from './modal-header.module.scss'

export namespace ModalHeader {
  export type Props = {
    title: string
  }
}

export const ModalHeader: React.FC<ModalHeader.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.title}</div>
    </div>
  )
}

import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './modal-header.module.scss'

export namespace ModalHeader {
  export type Props = {
    title: string
    on_click_close: () => void
  }
}

export const ModalHeader: React.FC<ModalHeader.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.title}</div>
      <button className={styles.close} onClick={props.on_click_close}>
        <Icon variant="ADD" />
      </button>
    </div>
  )
}

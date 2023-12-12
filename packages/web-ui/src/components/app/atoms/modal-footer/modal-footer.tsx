import { ReactNode } from 'react'
import styles from './modal-footer.module.scss'

export namespace ModalFooter {
  export type Props = {
    slot_right_side: ReactNode
  }
}

export const ModalFooter: React.FC<ModalFooter.Props> = (props) => {
  return <div className={styles.container}>{props.slot_right_side}</div>
}

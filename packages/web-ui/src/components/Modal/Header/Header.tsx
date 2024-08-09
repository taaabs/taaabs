import { Icon as UiIcon } from '@web-ui/components/Icon'
import styles from './Header.module.scss'

export namespace Header {
  export type Props = {
    title: string
    on_close: () => void
    children?: React.ReactNode
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.children && <div className={styles.slot}>{props.children}</div>}
      <div className={styles.title}>{props.title}</div>
      <button className={styles.close} onClick={props.on_close}>
        <UiIcon variant="CROSS" />
      </button>
    </div>
  )
}

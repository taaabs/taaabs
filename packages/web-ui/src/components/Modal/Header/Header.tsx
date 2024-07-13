import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './Header.module.scss'

export namespace Header {
  export type Props = {
    title: string
    on_close: () => void
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.title}</div>
      <button className={styles.close} onClick={props.on_close}>
        <Icon variant="REMOVE" />
      </button>
    </div>
  )
}

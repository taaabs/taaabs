import { Icon } from '@web-ui/components/Icon'
import styles from './Header.module.scss'

export namespace Header {
  export type Props = {
    settings_on_click: () => void
    shortcut: string
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  return (
    <div className={styles.container}>
      <Icon variant="LOGO" />
      <div className={styles.actions}>
        <div className={styles.actions__shortcut}>
          <Icon variant="BULB" />
          <span> {props.shortcut}</span>
        </div>
        <button
          className={styles.actions__settings}
          onClick={props.settings_on_click}
        >
          <Icon variant="SETTINGS" />
        </button>
      </div>
    </div>
  )
}

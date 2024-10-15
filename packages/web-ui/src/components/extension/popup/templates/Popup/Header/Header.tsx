import { Icon } from '@web-ui/components/Icon'
import styles from './Header.module.scss'

export namespace Header {
  export type Props = {
    settings_on_click: () => void
    shortcut: string
    translations: {
      trigger_popup_shortcut: string
    }
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  const is_firefox = navigator.userAgent.includes('Firefox')

  return (
    <div className={styles.container}>
      <Icon variant="LOGO" />
      <div className={styles.actions}>
        {!is_firefox && (
          <div
            className={styles.actions__shortcut}
            title={props.translations.trigger_popup_shortcut}
          >
            <Icon variant="BULB" />
            <span> {props.shortcut}</span>
          </div>
        )}
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

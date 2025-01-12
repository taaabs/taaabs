import { Icon } from '@web-ui/components/Icon'
import styles from './Header.module.scss'
import cn from 'classnames'

export namespace Header {
  export type Props = {
    settings_on_click: () => void
    vision_mode_on_click: () => void
    is_vision_mode_available: boolean
    logo_on_click?: () => void
    translations: {
      trigger_popup_shortcut: string
    }
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  const is_firefox = navigator.userAgent.includes('Firefox')

  return (
    <div className={styles.container}>
      {props.is_vision_mode_available && (
        <div className={styles.vision}>
          <button onClick={props.vision_mode_on_click}>
            <Icon variant="SCREENSHOT" />
          </button>
        </div>
      )}
      <button
        className={styles.logo}
        style={props.logo_on_click ? undefined : { pointerEvents: 'none' }}
        onClick={props.logo_on_click}
      >
        <Icon variant="LOGO" />
      </button>
      <div className={styles.actions}>
        {!is_firefox && (
          <div className={styles.actions__shortcut}>
            <div className={styles.actions__shortcut__key}>Alt</div>
            <span className={styles.actions__shortcut__plus}>+</span>
            <div className={styles.actions__shortcut__key}>S</div>
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

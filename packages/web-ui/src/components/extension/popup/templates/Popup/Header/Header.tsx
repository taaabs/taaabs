import { Icon } from '@web-ui/components/Icon'
import styles from './Header.module.scss'

export namespace Header {
  export type Props = {
    settings_on_click: () => void
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  return (
    <div className={styles.container}>
      <Icon variant="LOGO" />
      <button
        className={styles.settings}
        onClick={props.settings_on_click}
      >
        <Icon variant="SETTINGS" />
      </button>
    </div>
  )
}

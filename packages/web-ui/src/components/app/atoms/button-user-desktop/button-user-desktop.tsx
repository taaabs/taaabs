import { Blurhash } from 'react-blurhash'
import styles from './button-user-desktop.module.scss'
import { Icon } from '@web-ui/components/common/particles/icon'

export namespace ButtonDesktopUser {
  export type Props = {
    name?: string
    avatar?: {
      url: string
      blurhash: string
    }
    on_click: () => void
  }
}

export const ButtonDesktopUser: React.FC<ButtonDesktopUser.Props> = (props) => {
  return (
    <button className={styles.button} onClick={props.on_click}>
      {props.name && <span>{props.name}</span>}
      {props.avatar ? (
        <div className={styles.button__avatar}>
          <div className={styles.button__avatar__blurhash}>
            <Blurhash hash={props.avatar.blurhash} />
          </div>
          <img src={props.avatar.url} alt={props.name} />
        </div>
      ) : (
        <div className={styles.button__icon}>
          <Icon variant="USER" />
        </div>
      )}
    </button>
  )
}

import { Blurhash } from 'react-blurhash'
import styles from './_ButtonUserDesktop.module.scss'
import { Icon as UiIcon } from '@web-ui/components/Icon'

export namespace _ButtonUserDesktop {
  export type Props = {
    name?: string
    avatar?: {
      url: string
      blurhash: string
    }
    on_click: () => void
  }
}

export const _ButtonUserDesktop: React.FC<_ButtonUserDesktop.Props> = (
  props,
) => {
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
          <UiIcon variant="USER" />
        </div>
      )}
    </button>
  )
}

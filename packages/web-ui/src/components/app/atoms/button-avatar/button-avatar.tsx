import { Blurhash } from 'react-blurhash'
import styles from './button-avatar.module.scss'

export namespace ButtonAvatar {
  export type Props = {
    on_click: () => void
    alt: string
    url: string
    blurhash: string
    test_id?: string
  }
}

export const ButtonAvatar: React.FC<ButtonAvatar.Props> = (props) => {
  return (
    <button
      className={styles.button}
      onClick={props.on_click}
      data-testid={props.test_id}
    >
      <div className={styles.blurhash}>
        <Blurhash hash={props.blurhash} />
      </div>
      <img src={props.url} alt={props.alt} />
    </button>
  )
}

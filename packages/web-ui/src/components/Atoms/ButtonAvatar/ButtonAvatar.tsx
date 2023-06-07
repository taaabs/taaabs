import { Blurhash } from 'react-blurhash'
import styles from './ButtonAvatar.module.scss'

export namespace ButtonAvatarTypes {
  export type Props = {
    onClick: () => void
    url: string
    blurhash: string
  }
}

export const ButtonAvatar: React.FC<ButtonAvatarTypes.Props> = (props) => {
  return (
    <button className={styles.button} onClick={props.onClick}>
      <div className={styles.blurhash}>
        <Blurhash hash={props.blurhash} />
      </div>
      <img src={props.url} />
    </button>
  )
}

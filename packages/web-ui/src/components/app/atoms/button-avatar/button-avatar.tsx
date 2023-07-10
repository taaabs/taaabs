import { Blurhash } from 'react-blurhash'
import styles from './button-avatar.module.scss'

export namespace ButtonAvatar {
  export type Props = {
    onClick: () => void
    alt: string
    url: string
    blurhash: string
    testId?: string
  }
}

export const ButtonAvatar: React.FC<ButtonAvatar.Props> = (props) => {
  return (
    <button
      className={styles.button}
      onClick={props.onClick}
      data-testid={props.testId}
    >
      <div className={styles.blurhash}>
        <Blurhash hash={props.blurhash} />
      </div>
      <img src={props.url} alt={props.alt} />
    </button>
  )
}

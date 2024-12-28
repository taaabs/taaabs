import { Icon } from '@web-ui/components/Icon'
import styles from './_MobilePublicUserInfo.module.scss'
import { Blurhash } from 'react-blurhash'

export namespace _MobilePublicUserInfo {
  export type Props = {
    username: string
    avatar?: {
      url: string
      blurhash: string
    }
  }
}

export const _MobilePublicUserInfo: React.FC<_MobilePublicUserInfo.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        {props.avatar ? (
          <>
            <Blurhash hash={props.avatar.blurhash} />
          </>
        ) : (
          <Icon variant="USER" />
        )}
      </div>
      {props.username && (
        <div className={styles.username}>{props.username}</div>
      )}
    </div>
  )
}

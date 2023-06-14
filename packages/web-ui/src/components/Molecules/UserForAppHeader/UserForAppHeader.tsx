import Link from 'next/link'
import { Icon } from '@web-ui/components/Atoms/Icon'
import styles from './UserForAppHeader.module.scss'
import { Blurhash } from 'react-blurhash'

export namespace UserForAppHeaderTypes {
  export type User = {
    username: string
    avatar?: {
      url: string
      blurhash: string
    }
    backHref: string
  }
  export type Props = {
    user: User
  }
}

export const UserForAppHeader: React.FC<UserForAppHeaderTypes.Props> = ({
  user,
}) => {
  return (
    <div className={styles.container}>
      <Link className={styles['back-arrow']} href={user.backHref}>
        <Icon variant="LESS_THAN" />
      </Link>
      <div className={styles['avatar-and-username']}>
        {user.avatar ? (
          <div className={styles['avatar-and-username__avatar-image']}>
            <div
              className={styles['avatar-and-username__avatar-image__blurhash']}
            >
              <Blurhash hash={user.avatar.blurhash} />
            </div>
            <img src={user.avatar.url} />
          </div>
        ) : (
          <div className={styles['avatar-and-username__abatar-icon']}>
            <Icon variant="USER" />
          </div>
        )}

        <span className={styles['avatar-and-username__username']}>
          {user.username}
        </span>
      </div>
    </div>
  )
}

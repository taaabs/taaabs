import Link from 'next/link'
import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './user-for-header.module.scss'
import { Blurhash } from 'react-blurhash'
import Skeleton from 'react-loading-skeleton'

export namespace UserForHeader {
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
    isLoadingAvatar: boolean
  }
}

export const UserForHeader: React.FC<UserForHeader.Props> = ({
  user,
  isLoadingAvatar,
}) => {
  const avatar: JSX.Element = user.avatar ? (
    <div className={styles['avatar-and-username__avatar-image']}>
      <div className={styles['avatar-and-username__avatar-image__blurhash']}>
        <Blurhash hash={user.avatar.blurhash} />
      </div>
      <img src={user.avatar.url} />
    </div>
  ) : (
    <div className={styles['avatar-and-username__avatar-icon']}>
      <Icon variant="USER" />
    </div>
  )

  return (
    <div className={styles.container}>
      <Link className={styles['back-arrow']} href={user.backHref}>
        <Icon variant="LESS_THAN" />
      </Link>
      <div className={styles['avatar-and-username']}>
        {isLoadingAvatar ? (
          <div className={styles['avatar-and-username__skeleton']}>
            <Skeleton circle={true} />
          </div>
        ) : (
          avatar
        )}

        <span className={styles['avatar-and-username__username']}>
          {user.username}
        </span>
      </div>
    </div>
  )
}

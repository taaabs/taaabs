import Link from 'next/link'
import { Ui } from '@web-ui'
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
    back_href: string
  }
  export type Props = {
    user: User
    is_loading_avatar: boolean
  }
}

export const UserForHeader: React.FC<UserForHeader.Props> = (props) => {
  const avatar: JSX.Element = props.user.avatar ? (
    <div className={styles['avatar-and-username__avatar-image']}>
      <div className={styles['avatar-and-username__avatar-image__blurhash']}>
        <Blurhash hash={props.user.avatar.blurhash} />
      </div>
      <img src={props.user.avatar.url} />
    </div>
  ) : (
    <div className={styles['avatar-and-username__avatar-icon']}>
      <Ui.Common.Particles.Icon variant="USER" />
    </div>
  )

  return (
    <div className={styles.container}>
      <Link className={styles['back-arrow']} href={props.user.back_href}>
        <Ui.Common.Particles.Icon variant="LESS_THAN" />
      </Link>
      <div className={styles['avatar-and-username']}>
        {props.is_loading_avatar ? (
          <div className={styles['avatar-and-username__skeleton']}>
            <Skeleton circle={true} />
          </div>
        ) : (
          avatar
        )}

        <span className={styles['avatar-and-username__username']}>
          {props.user.username}
        </span>
      </div>
    </div>
  )
}

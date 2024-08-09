import Link from 'next/link'
import styles from './UsernameWithBackArrow.module.scss'
import { Blurhash } from 'react-blurhash'
import Skeleton from 'react-loading-skeleton'
import { Icon as UiIcon } from '@web-ui/components/Icon'

export namespace UsernameWithBackArrow {
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

export const UsernameWithBackArrow: React.FC<UsernameWithBackArrow.Props> = (
  props,
) => {
  const avatar: JSX.Element = props.user.avatar ? (
    <div className={styles['avatar-and-username__avatar-image']}>
      <div className={styles['avatar-and-username__avatar-image__blurhash']}>
        <Blurhash hash={props.user.avatar.blurhash} />
      </div>
      <img src={props.user.avatar.url} />
    </div>
  ) : (
    <div className={styles['avatar-and-username__avatar-icon']}>
      <UiIcon variant="USER" />
    </div>
  )

  return (
    <div className={styles.container}>
      <Link className={styles['back-arrow']} href={props.user.back_href}>
        <UiIcon variant="LESS_THAN" />
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

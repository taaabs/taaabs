import Link from 'next/link'
import { Icon } from '@web-ui/components/Atoms/Icon'
import { ButtonOutlinedIcon } from '@web-ui/components/Atoms/ButtonOutlinedIcon'
import styles from './UserForHeader.module.scss'
import { ButtonAvatar } from '@web-ui/components/Atoms/ButtonAvatar'

export namespace UserForHeaderTypes {
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

export const UserForHeader: React.FC<UserForHeaderTypes.Props> = ({ user }) => {
  return (
    <div className={styles.container}>
      <Link className={styles['back-arrow']} href={user.backHref}>
        <Icon variant="LESS_THAN" />
      </Link>
      <Link
        className={styles['avatar-and-username']}
        href={`/${user.username}`}
      >
        {user.avatar ? (
          <ButtonAvatar
            blurhash={user.avatar?.blurhash}
            onClick={() => {}}
            url={user.avatar.url}
          />
        ) : (
          <ButtonOutlinedIcon iconVariant="USER" onClick={() => {}} />
        )}

        <span className={styles['avatar-and-username__username']}>
          {user.username}
        </span>
      </Link>
    </div>
  )
}

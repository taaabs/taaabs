import { SearchBox } from '@web-ui/components/app/molecules/search-box'
import { ButtonAvatar } from '@web-ui/components/app/atoms/button-avatar'
import styles from './desktop-user-area-for-app-header.module.scss'
import { ButtonOutlinedIcon } from '../../atoms/button-outlined-icon'

export namespace DesktopUserAreaForAppHeader {
  export type Props = {
    avatar?: {
      url: string
      blurhash: string
    }
    onClickSearch: () => void
    onClickAdd: () => void
    onClickNotifications: () => void
  }
}

export const DesktopUserAreaForAppHeader: React.FC<
  DesktopUserAreaForAppHeader.Props
> = (props) => {
  return (
    <div className={styles.container}>
      <SearchBox onClick={() => {}} placeholder="Search anything..." />
      <ButtonOutlinedIcon iconVariant="ADD" onClick={props.onClickAdd} />
      <ButtonOutlinedIcon
        iconVariant="NOTIFICATIONS"
        onClick={props.onClickNotifications}
      />
      {props.avatar ? (
        <ButtonAvatar
          url={props.avatar.url}
          blurhash={props.avatar.blurhash}
          onClick={() => {}}
          alt="XYZ"
        />
      ) : (
        <ButtonOutlinedIcon iconVariant="USER" onClick={() => {}} />
      )}
    </div>
  )
}

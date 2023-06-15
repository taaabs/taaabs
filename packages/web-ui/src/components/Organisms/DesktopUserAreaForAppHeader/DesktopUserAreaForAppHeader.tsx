import { ButtonOutlinedIcon } from '@web-ui/components/Atoms/ButtonOutlinedIcon'
import { SearchBox } from '@web-ui/components/Molecules/SearchBox'
import { ButtonAvatar } from '@web-ui/components/Atoms/ButtonAvatar'
import styles from './DesktopUserAreaForAppHeader.module.scss'

export namespace DesktopUserAreaForAppHeaderTypes {
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
  DesktopUserAreaForAppHeaderTypes.Props
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

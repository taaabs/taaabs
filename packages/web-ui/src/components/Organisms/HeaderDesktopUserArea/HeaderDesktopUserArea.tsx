import { ButtonOutlinedIcon } from '@web-ui/components/Atoms/ButtonOutlinedIcon'
import { SearchBox } from '@web-ui/components/Molecules/SearchBox'
import { ButtonAvatar } from '@web-ui/components/Atoms/ButtonAvatar'
import styles from './HeaderDesktopUserArea.module.scss'

export namespace HeaderDesktopUserAreaTypes {
  export type Props = {
    avatar?: {
      url: string
      blurhash: string
    }
    onClickSearch: () => void
    onClickTheme: () => void
    onClickAdd: () => void
    onClickNotifications: () => void
    currentTheme: 'LIGHT' | 'DARK'
  }
}

export const HeaderDesktopUserArea: React.FC<
  HeaderDesktopUserAreaTypes.Props
> = (props) => {
  return (
    <div className={styles.container}>
      <SearchBox onClick={() => {}} placeholder="Search anything..." />
      <ButtonOutlinedIcon iconVariant="ADD" onClick={props.onClickAdd} />
      <ButtonOutlinedIcon
        iconVariant="NOTIFICATIONS"
        onClick={props.onClickNotifications}
      />
      <ButtonOutlinedIcon iconVariant="SUN" onClick={props.onClickTheme} />
      {props.avatar ? (
        <ButtonAvatar
          url={props.avatar.url}
          blurhash={props.avatar.blurhash}
          onClick={() => {}}
        />
      ) : (
        <ButtonOutlinedIcon iconVariant="USER" onClick={() => {}} />
      )}
    </div>
  )
}

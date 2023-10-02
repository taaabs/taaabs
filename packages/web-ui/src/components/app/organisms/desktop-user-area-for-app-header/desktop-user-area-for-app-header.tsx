import { SearchBox } from '@web-ui/components/app/atoms/search-box'
import { ButtonAvatar } from '@web-ui/components/app/atoms/button-avatar'
import styles from './desktop-user-area-for-app-header.module.scss'
import { ButtonOutlinedIcon } from '../../atoms/button-outlined-icon'

export namespace DesktopUserAreaForAppHeader {
  export type Props = {
    avatar?: {
      url: string
      blurhash: string
    }
    search_on_click: () => void
    add_on_click: () => void
    notificatios_on_click: () => void
  }
}

export const DesktopUserAreaForAppHeader: React.FC<
  DesktopUserAreaForAppHeader.Props
> = (props) => {
  return (
    <div className={styles.container}>
      <SearchBox on_click={() => {}} placeholder="Search anything..." />
      <ButtonOutlinedIcon icon_variant="ADD" on_click={props.add_on_click} />
      <ButtonOutlinedIcon
        icon_variant="NOTIFICATIONS"
        on_click={props.notificatios_on_click}
      />
      <ButtonOutlinedIcon icon_variant="SUN" on_click={() => {}} />
      {props.avatar ? (
        <ButtonAvatar
          url={props.avatar.url}
          blurhash={props.avatar.blurhash}
          on_click={() => {}}
          alt="XYZ"
        />
      ) : (
        <ButtonOutlinedIcon icon_variant="USER" on_click={() => {}} />
      )}
    </div>
  )
}

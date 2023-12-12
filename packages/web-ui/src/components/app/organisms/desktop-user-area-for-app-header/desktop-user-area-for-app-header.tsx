import { ButtonAvatar } from '@web-ui/components/app/atoms/button-avatar'
import styles from './desktop-user-area-for-app-header.module.scss'
import { ButtonOutlinedIcon } from '../../atoms/button-outlined-icon'

export namespace DesktopUserAreaForAppHeader {
  export type Props = {
    avatar?: {
      url: string
      blurhash: string
    }
    on_click_search: () => void
    on_click_add: () => void
  }
}

export const DesktopUserAreaForAppHeader: React.FC<
  DesktopUserAreaForAppHeader.Props
> = (props) => {
  return (
    <div className={styles.container}>
      <ButtonOutlinedIcon
        icon_variant="SEARCH"
        on_click={props.on_click_search}
      />
      <ButtonOutlinedIcon icon_variant="ADD" on_click={props.on_click_add} />
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

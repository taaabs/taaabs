import { Ui } from '@web-ui'
import styles from './desktop-user-area-for-app-header.module.scss'

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
      <Ui.App.Atoms.ButtonOutlinedIcon
        icon_variant="SEARCH"
        on_click={props.on_click_search}
      />
      <Ui.App.Atoms.ButtonOutlinedIcon
        icon_variant="ADD"
        on_click={props.on_click_add}
      />
      {props.avatar ? (
        <Ui.App.Atoms.ButtonAvatar
          url={props.avatar.url}
          blurhash={props.avatar.blurhash}
          on_click={() => {}}
          alt="XYZ"
        />
      ) : (
        <Ui.App.Atoms.ButtonOutlinedIcon
          icon_variant="USER"
          on_click={() => {}}
        />
      )}
    </div>
  )
}

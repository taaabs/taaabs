import { useState } from 'react'
import { ButtonOutlinedIcon } from '../../atoms/button-outlined-icon'
import styles from './desktop-user-area-for-app-header.module.scss'
import { ButtonDesktopUser } from '../../atoms/button-user-desktop'

export namespace DesktopUserAreaForAppHeader {
  export type Props = {
    name?: string
    avatar?: {
      url: string
      blurhash: string
    }
    on_click_search: () => void
    on_click_add: () => void
    slot_user_dropdown: React.ReactNode
  }
}

export const DesktopUserAreaForAppHeader: React.FC<
  DesktopUserAreaForAppHeader.Props
> = (props) => {
  const [is_user_dropdown_visible, set_is_user_dropdown_visible] =
    useState<boolean>()

  return (
    <div className={styles.container}>
      <ButtonOutlinedIcon
        icon_variant="SEARCH"
        on_click={props.on_click_search}
      />
      <ButtonOutlinedIcon icon_variant="ADD" on_click={props.on_click_add} />
      <div className={styles.user}>
        <ButtonDesktopUser
          name={props.name}
          avatar={props.avatar}
          on_click={() => {
            set_is_user_dropdown_visible(!is_user_dropdown_visible)
          }}
        />
        <div className={styles.user__dropdown}>{props.slot_user_dropdown}</div>
      </div>
    </div>
  )
}

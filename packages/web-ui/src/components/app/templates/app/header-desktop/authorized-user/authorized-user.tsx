import { useState } from 'react'
import { ButtonOutlinedIcon } from '../../../../atoms/button-outlined-icon'
import styles from './authorized-user.module.scss'
import { ButtonUserDesktop } from '../../../../atoms/button-user-desktop'
import cn from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'

export namespace AuthorizedUser {
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

export const AuthorizedUser: React.FC<AuthorizedUser.Props> = (props) => {
  const [is_user_dropdown_visible, set_is_user_dropdown_visible] =
    useState<boolean>()

  return (
    <div className={styles.container}>
      {/* <ButtonOutlinedIcon
        icon_variant="SEARCH"
        on_click={props.on_click_search}
      /> */}
      <ButtonOutlinedIcon icon_variant="ADD" on_click={props.on_click_add} />
      <div className={styles.user}>
        <ButtonUserDesktop
          name={props.name}
          avatar={props.avatar}
          on_click={() => {
            set_is_user_dropdown_visible(!is_user_dropdown_visible)
          }}
        />
        <div
          className={cn(styles.user__dropdown, {
            [styles['user__dropdown--visible']]: is_user_dropdown_visible,
          })}
        >
          <OutsideClickHandler
            disabled={!is_user_dropdown_visible}
            onOutsideClick={() => {
              set_is_user_dropdown_visible(false)
            }}
          >
            {props.slot_user_dropdown}
          </OutsideClickHandler>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import styles from './UserArea.module.scss'
import { _ButtonUserDesktop } from '../common/_ButtonUserDesktop'
import cn from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { _IconButton } from '../common/_IconButton'

export namespace UserArea {
  export type Props = {
    name?: string
    avatar?: {
      url: string
      blurhash: string
    }
    pathname?: string
    on_click_add?: () => void
    slot_user_dropdown?: React.ReactNode
  }
}

export const UserArea: React.FC<UserArea.Props> = (props) => {
  const [is_user_dropdown_visible, set_is_user_dropdown_visible] =
    useState<boolean>()

  useUpdateEffect(() => {
    set_is_user_dropdown_visible(false)
  }, [props.pathname])

  return (
    <div className={styles.container}>
      {props.on_click_add && (
        <_IconButton icon_variant="ADD" on_click={props.on_click_add} />
      )}

      <div className={styles['theme-set-by-system']}>
        <div className={styles.dark}>
          <_IconButton
            icon_variant="THEME_AUTO"
            on_click={() => {
              ;(window as any).__set_preferred_theme('light')
            }}
            aria_label="Use dark mode"
          />
        </div>
        <div className={styles.light}>
          <_IconButton
            icon_variant="THEME_AUTO"
            on_click={() => {
              ;(window as any).__set_preferred_theme('dark')
            }}
            aria_label="Use light mode"
          />
        </div>
      </div>

      <div className={styles['theme-set-by-user']}>
        <div className={styles.dark}>
          <_IconButton
            icon_variant="THEME_DARK"
            on_click={() => {
              if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
                ;(window as any).__set_preferred_theme()
              } else {
                ;(window as any).__set_preferred_theme('light')
              }
            }}
            aria_label="Use dark mode"
          />
        </div>
        <div className={styles.light}>
          <_IconButton
            icon_variant="THEME_LIGHT"
            on_click={() => {
              if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                ;(window as any).__set_preferred_theme()
              } else {
                ;(window as any).__set_preferred_theme('dark')
              }
            }}
            aria_label="Use light mode"
          />
        </div>
      </div>

      {props.name && (
        <div className={styles.user}>
          <_ButtonUserDesktop
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
              {props.slot_user_dropdown as any}
            </OutsideClickHandler>
          </div>
        </div>
      )}
    </div>
  )
}

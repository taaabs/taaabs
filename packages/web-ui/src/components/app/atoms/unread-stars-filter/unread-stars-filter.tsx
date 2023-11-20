import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './unread-stars-filter.module.scss'
import cn from 'classnames'
import { useState } from 'react'

export namespace UnreadStarsFilter {
  export type Props = {
    is_unread_selected?: boolean
    unread_click_handler?: () => void
    selected_stars: 0 | 1 | 2 | 3
    stars_click_handler: (selected_stars: number) => void
  }
}

export const UnreadStarsFilter: React.FC<UnreadStarsFilter.Props> = (props) => {
  const [hovered_star, set_hovered_star] = useState<1 | 2 | 3 | undefined>(
    undefined,
  )

  return (
    <div className={styles.container}>
      {props.is_unread_selected !== undefined &&
        props.unread_click_handler !== undefined && (
          <button
            className={cn(styles.unread, {
              [styles['unread--selected']]: props.is_unread_selected,
            })}
            onClick={props.unread_click_handler}
          />
        )}
      <div className={styles.stars}>
        <button
          className={cn(styles.stars__star, {
            [styles['stars__star--hover']]: hovered_star && hovered_star >= 1,
            [styles['stars__star--selected']]: props.selected_stars >= 1,
          })}
          onClick={() => {
            props.stars_click_handler(1)
          }}
          onPointerEnter={() => {
            set_hovered_star(1)
          }}
          onPointerLeave={() => {
            set_hovered_star(undefined)
          }}
        >
          <Icon variant="STAR_FILLED" />
        </button>
        <button
          className={cn(styles.stars__star, {
            [styles['stars__star--hover']]: hovered_star && hovered_star >= 2,
            [styles['stars__star--selected']]: props.selected_stars >= 2,
          })}
          onClick={() => {
            props.stars_click_handler(2)
          }}
          onPointerEnter={() => {
            set_hovered_star(2)
          }}
          onPointerLeave={() => {
            set_hovered_star(undefined)
          }}
        >
          <Icon variant="STAR_FILLED" />
        </button>
        <button
          className={cn(styles.stars__star, {
            [styles['stars__star--hover']]: hovered_star && hovered_star == 3,
            [styles['stars__star--selected']]: props.selected_stars == 3,
          })}
          onClick={() => {
            props.stars_click_handler(3)
          }}
          onPointerEnter={() => {
            set_hovered_star(3)
          }}
          onPointerLeave={() => {
            set_hovered_star(undefined)
          }}
        >
          <Icon variant="STAR_FILLED" />
        </button>
      </div>
    </div>
  )
}

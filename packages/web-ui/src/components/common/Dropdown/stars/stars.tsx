import { useState } from 'react'
import { Icon } from '../../particles/icon'
import styles from './stars.module.scss'
import cn from 'classnames'

export namespace Stars {
  export type Props = {
    no_selected: number
    on_click: (no_stars: number) => void
  }
}

export const Stars: React.FC<Stars.Props> = (props) => {
  const [hovered_index, set_hovered_index] = useState<number>()

  return (
    <button className={styles.container}>
      {[...new Array(5)].map((_, i) => (
        <div
          className={cn([
            styles.star,
            {
              [styles['star--checked']]:
                props.no_selected - 1 >= i &&
                (hovered_index === undefined || hovered_index >= i),
              [styles['star--hovered']]:
                hovered_index !== undefined && hovered_index >= i,
              [styles['star--hovered-checked']]:
                hovered_index == props.no_selected - 1,
            },
          ])}
          key={i}
          onMouseEnter={() => {
            set_hovered_index(i)
          }}
          onMouseLeave={() => {
            set_hovered_index(undefined)
          }}
          onClick={() => {
            props.on_click(i + 1)
          }}
        >
          {props.no_selected - 1 >= i ||
          (hovered_index !== undefined && hovered_index >= i) ? (
            <Icon variant="STAR_FILLED" />
          ) : (
            <Icon variant="STAR" />
          )}
        </div>
      ))}
    </button>
  )
}

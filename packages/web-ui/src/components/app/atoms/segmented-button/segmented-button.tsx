import { memo, useEffect, useRef, useState } from 'react'
import styles from './segmented-button.module.scss'
import cn from 'classnames'
import useWindowResize from 'beautiful-react-hooks/useWindowResize'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_is_hydrated } from '@shared/hooks'

namespace SegmentedButton {
  export type Props = {
    items: { label: string; is_selected: boolean }[]
    on_item_click: (option_idx: number) => void
    is_disabled?: boolean
    is_not_interactive?: boolean
  }
}

// Component can handle 2 or 3 items.
export const SegmentedButton: React.FC<SegmentedButton.Props> = memo(
  (props) => {
    const is_hydrated = use_is_hydrated()
    const on_window_resize = useWindowResize()
    const [selected_idx, set_selected_idx] = useState(
      props.items.findIndex((option) => option.is_selected),
    )
    const item_1 = useRef<HTMLButtonElement>(null)
    const item_2 = useRef<HTMLButtonElement>(null)
    const item_3 = useRef<HTMLButtonElement>(null)

    const [item_widths, set_item_widths] = useState<number[]>()

    const get_and_set_item_widths = () => {
      const option_widths: number[] = []
      option_widths.push(item_1.current!.getBoundingClientRect().width)
      option_widths.push(item_2.current!.getBoundingClientRect().width)
      if (item_3.current) {
        option_widths.push(item_3.current!.getBoundingClientRect().width)
      }
      set_item_widths(option_widths)
    }

    useUpdateEffect(() => {
      set_selected_idx(props.items.findIndex((option) => option.is_selected))
    }, [props.is_disabled])

    on_window_resize(() => {
      get_and_set_item_widths()
    })

    useEffect(() => {
      get_and_set_item_widths()
    }, [is_hydrated])

    return (
      <div
        className={cn(styles.container, {
          [styles['container--disabled']]: props.is_disabled,
        })}
      >
        {item_widths && !props.is_disabled && (
          <div
            className={styles.selection}
            style={{
              width: item_widths[selected_idx],
              transform:
                selected_idx == 2
                  ? `translateX(${item_widths[0] + item_widths[1]}px)`
                  : selected_idx == 1
                  ? `translateX(${item_widths[0]}px)`
                  : undefined,
            }}
          />
        )}
        <button
          ref={item_1}
          onClick={() => {
            if (props.is_not_interactive) return
            props.on_item_click(0)
            set_selected_idx(0)
          }}
          className={cn(styles.button, {
            [styles['button--selected']]:
              selected_idx == 0 && !props.is_disabled,
            [styles['button--show-separator-after']]: selected_idx == 2,
          })}
          title={props.items[0].label}
        >
          {props.items[0].label}
        </button>
        <button
          ref={item_2}
          onClick={() => {
            if (props.is_not_interactive) return
            props.on_item_click(1)
            set_selected_idx(1)
          }}
          className={cn(styles.button, {
            [styles['button--selected']]:
              selected_idx == 1 && !props.is_disabled,
            [styles['button--show-separator-after']]:
              props.items.length == 3 && selected_idx == 0,
          })}
          title={props.items[1].label}
        >
          {props.items[1].label}
        </button>
        {props.items.length == 3 && (
          <button
            ref={item_3}
            onClick={() => {
              if (props.is_not_interactive) return
              props.on_item_click(2)
              set_selected_idx(2)
            }}
            className={cn(styles.button, {
              [styles['button--selected']]:
                selected_idx == 2 && !props.is_disabled,
            })}
            title={props.items[2].label}
          >
            {props.items[2].label}
          </button>
        )}
      </div>
    )
  },
  (o, n) =>
    o.is_disabled == n.is_disabled &&
    o.is_not_interactive == n.is_not_interactive,
)

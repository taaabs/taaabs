import { memo, useEffect, useRef, useState } from 'react'
import styles from './segmented-button.module.scss'
import cn from 'classnames'
import useWindowResize from 'beautiful-react-hooks/useWindowResize'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

namespace SegmentedButton {
  export type Props = {
    options: { label: string; is_selected: boolean }[]
    on_option_click: (option_idx: number) => void
    is_disabled?: boolean
    is_not_interactive?: boolean
  }
}

// Components can handle 2 or 3 options.
export const SegmentedButton: React.FC<SegmentedButton.Props> = memo(
  (props) => {
    const on_window_resize = useWindowResize()
    const [selected_idx, set_selected_idx] = useState(
      props.options.findIndex((option) => option.is_selected),
    )
    const option_1 = useRef<HTMLButtonElement>(null)
    const option_2 = useRef<HTMLButtonElement>(null)
    const option_3 = useRef<HTMLButtonElement>(null)

    const [option_widths, set_option_widths] = useState<number[]>()

    const get_and_set_option_widths = () => {
      const option_widths: number[] = []
      option_widths.push(option_1.current!.getBoundingClientRect().width)
      option_widths.push(option_2.current!.getBoundingClientRect().width)
      if (option_3.current) {
        option_widths.push(option_3.current!.getBoundingClientRect().width)
      }
      set_option_widths(option_widths)
    }

    useUpdateEffect(() => {
      set_selected_idx(props.options.findIndex((option) => option.is_selected))
    }, [props.is_disabled])

    on_window_resize(() => {
      get_and_set_option_widths()
    })

    useEffect(() => {
      get_and_set_option_widths()
    }, [])

    return (
      <div
        className={cn(styles.container, {
          [styles['container--disabled']]: props.is_disabled,
        })}
      >
        {option_widths && !props.is_disabled && (
          <div
            className={styles.selection}
            style={{
              width: option_widths[selected_idx],
              transform:
                selected_idx == 2
                  ? `translateX(${option_widths[0] + option_widths[1]}px)`
                  : selected_idx == 1
                  ? `translateX(${option_widths[0]}px)`
                  : undefined,
            }}
          />
        )}
        <button
          ref={option_1}
          onClick={() => {
            if (props.is_not_interactive) return
            props.on_option_click(0)
            set_selected_idx(0)
          }}
          className={cn(styles.button, {
            [styles['button--selected']]:
              selected_idx == 0 && !props.is_disabled,
          })}
          title={props.options[0].label}
        >
          {props.options[0].label}
        </button>
        <button
          ref={option_2}
          onClick={() => {
            if (props.is_not_interactive) return
            props.on_option_click(1)
            set_selected_idx(1)
          }}
          className={cn(styles.button, {
            [styles['button--selected']]:
              selected_idx == 1 && !props.is_disabled,
          })}
          title={props.options[1].label}
        >
          {props.options[1].label}
        </button>
        {props.options.length == 3 && (
          <button
            ref={option_3}
            onClick={() => {
              if (props.is_not_interactive) return
              props.on_option_click(2)
              set_selected_idx(2)
            }}
            className={cn(styles.button, {
              [styles['button--selected']]:
                selected_idx == 2 && !props.is_disabled,
            })}
            title={props.options[2].label}
          >
            {props.options[2].label}
          </button>
        )}
      </div>
    )
  },
  (o, n) =>
    o.is_disabled == n.is_disabled &&
    o.is_not_interactive == n.is_not_interactive,
)

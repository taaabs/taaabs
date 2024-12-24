import styles from './SegmentedButton.module.scss'
import cn from 'classnames'

namespace SegmentedButton {
  export type Props = {
    items: { label: string; is_selected: boolean }[]
    on_item_click: (option_idx: number) => void
    is_disabled?: boolean
    is_not_interactive?: boolean
  }
}

export const SegmentedButton: React.FC<SegmentedButton.Props> = (props) => {
  if (props.items.length < 2 || props.items.length > 3) {
    return <div>SegmentedButton: should have 2 or 3 items</div>
  }

  return (
    <div
      className={cn(styles.container, {
        [styles['container--disabled']]: props.is_disabled,
      })}
    >
      {props.items.map((item, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.preventDefault()
            if (props.is_not_interactive) return
            props.on_item_click(index)
          }}
          className={cn(styles.button, {
            [styles['button--selected']]:
              item.is_selected && !props.is_disabled,
            [styles['button--show-separator-after']]:
              props.items.length == 3 &&
              !props.items[index].is_selected &&
              !props.items[index + 1]?.is_selected &&
              index < 2,
          })}
          title={item.label}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

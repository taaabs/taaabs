import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './simple-select-dropdown.module.scss'
import cn from 'classnames'

export namespace SimpleSelectDropdown {
  type Checkbox = {
    label: string
    on_click: () => void
    is_selected: boolean
    is_disabled?: boolean
  }
  type Item = {
    label: string
    on_click: () => void
    is_selected: boolean
  }
  export type Props = {
    items: Item[]
    checkboxes?: Checkbox[]
  }
}

export const SimpleSelectDropdown: React.FC<SimpleSelectDropdown.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <button className={styles.item} onClick={item.on_click} key={i}>
          <div
            className={cn([
              styles.item__tick,
              { [styles['item__tick--selected']]: item.is_selected },
            ])}
          >
            <Icon variant="SELECTED" />
          </div>
          <span>{item.label}</span>
        </button>
      ))}
      {props.checkboxes &&
        props.checkboxes.map((checkbox, i) => (
          <button
            className={cn([
              styles.item,
              styles['item--with-checkbox'],
              { [styles['item--disabled']]: checkbox.is_disabled },
            ])}
            onClick={checkbox.on_click}
            key={i}
          >
            <div
              className={cn([
                styles.item__checkbox,
                { [styles['item__checkbox--selected']]: checkbox.is_selected },
              ])}
            >
              <Icon variant="SELECTED" />
            </div>
            <span>{checkbox.label}</span>
          </button>
        ))}
    </div>
  )
}

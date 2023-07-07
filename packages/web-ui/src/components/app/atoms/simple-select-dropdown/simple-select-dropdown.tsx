import { Icon } from '@web-ui/components/common/atoms/icon'
import styles from './simple-select-dropdown.module.scss'
import cn from 'classnames'

export namespace SimpleSelectDropdownTypes {
  type Checkbox = {
    label: string
    onClick: () => void
    isSelected: boolean
    isDisabled?: boolean
  }
  type Item = {
    label: string
    onClick: () => void
    isSelected: boolean
  }
  export type Props = {
    items: Item[]
    checkboxes?: Checkbox[]
  }
}

export const SimpleSelectDropdown: React.FC<SimpleSelectDropdownTypes.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <button className={styles.item} onClick={item.onClick} key={i}>
          <div
            className={cn([
              styles.item__tick,
              { [styles['item__tick--selected']]: item.isSelected },
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
              { [styles['item--disabled']]: checkbox.isDisabled },
            ])}
            onClick={checkbox.onClick}
            key={i}
          >
            <div
              className={cn([
                styles.item__checkbox,
                { [styles['item__checkbox--selected']]: checkbox.isSelected },
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

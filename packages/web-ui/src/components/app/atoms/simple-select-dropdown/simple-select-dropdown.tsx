import { Icon } from '@web-ui/components/common/atoms/icon'
import styles from './simple-select-dropdown.module.scss'
import cn from 'classnames'

export namespace SimpleSelectDropdownTypes {
  type Item = {
    label: string
    onClick: () => void
    isSelected: boolean
  }
  export type Props = {
    items: Item[]
    toggle: () => void
  }
}

export const SimpleSelectDropdown: React.FC<SimpleSelectDropdownTypes.Props> = (
  props,
) => {
  return (
    <div>
      <div className={styles.toggler} onClick={props.toggle} />
      <div className={styles.container}>
        {props.items.map((item, i) => (
          <button className={styles.item} onClick={item.onClick} key={i}>
            <div
              className={cn([
                styles.item__icon,
                { [styles['item__icon--selected']]: item.isSelected },
              ])}
            >
              <Icon variant="SELECTED" />
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

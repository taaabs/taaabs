import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './dropdown-menu.module.scss'
import cn from 'classnames'

export namespace DropdownMenu {
  type Item = {
    label: React.ReactNode
    on_click: () => void
    is_selected?: boolean
    is_checked?: boolean
    is_disabled?: boolean
    other_icon?: React.ReactNode
  }
  export type Props = {
    items: Item[]
  }
}

export const DropdownMenu: React.FC<DropdownMenu.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) =>
        item.is_selected !== undefined || item.other_icon ? (
          <button
            className={cn([
              styles.item,
              { [styles['item--disabled']]: item.is_disabled },
            ])}
            onClick={item.on_click}
            key={i}
          >
            <div className={styles.item__icon}>
              {item.is_selected ? <Icon variant="SELECTED" /> : item.other_icon}
            </div>
            <span>{item.label}</span>
          </button>
        ) : item.is_checked !== undefined ? (
          <button
            className={cn([
              styles.item,
              styles['item--with-checkbox'],
              { [styles['item--disabled']]: item.is_disabled },
            ])}
            onClick={item.on_click}
            key={i}
          >
            <div
              className={cn([
                styles.item__checkbox,
                {
                  [styles['item__checkbox--checked']]: item.is_checked,
                },
              ])}
            >
              <Icon variant="SELECTED" />
            </div>
            <span>{item.label}</span>
          </button>
        ) : (
          <>Invalid props.</>
        ),
      )}
    </div>
  )
}

import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './bottom-navigation-bar.module.scss'
import cn from 'classnames'

export namespace BottomNavigationBar {
  type Item = {
    icon_variant: Icon.Variant
    icon_variant_active: Icon.Variant
    label: string
    on_click: () => void
    is_active: boolean
  }
  export type Props = {
    items: Item[]
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBar.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <button onClick={item.on_click} className={styles.item} key={i}>
          <Icon
            variant={
              !item.is_active ? item.icon_variant : item.icon_variant_active
            }
          />
          <div
            className={cn(styles.item__label, {
              [styles['item__label--active']]: item.is_active,
            })}
          >
            {item.label}
          </div>
        </button>
      ))}
    </div>
  )
}

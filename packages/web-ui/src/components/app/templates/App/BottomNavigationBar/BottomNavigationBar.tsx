import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './BottomNavigationBar.module.scss'
import cn from 'classnames'

export namespace BottomNavigationBar {
  type Item = {
    icon_variant: Icon.Variant
    icon_variant_active: Icon.Variant
    title: string
    on_click: () => void
    is_active: boolean
  }
  export type Props = {
    items: Item[]
    reset_scrolled_opacity_count?: number
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBar.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <button
          onClick={item.on_click}
          className={styles.item}
          key={i}
          title={item.title}
        >
          <Icon
            variant={
              item.is_active ? item.icon_variant_active : item.icon_variant
            }
          />
        </button>
      ))}
    </div>
  )
}
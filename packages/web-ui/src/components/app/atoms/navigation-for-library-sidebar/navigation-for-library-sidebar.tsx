import styles from './navigation-for-library-sidebar.module.scss'
import cn from 'classnames'

export namespace NavigationForLibrarySidebar {
  type NavigationItem = {
    label: string
    on_click: () => void
    is_active: boolean
  }
  export type Props = {
    navigation_items: NavigationItem[]
  }
}

export const NavigationForLibrarySidebar: React.FC<
  NavigationForLibrarySidebar.Props
> = (props) => (
  <nav className={styles.navigation}>
    {props.navigation_items.map((item, i) => (
      <button
        onClick={item.on_click}
        className={cn(styles.navigation__item, {
          [styles['navigation__item--active']]: item.is_active,
        })}
        key={i}
      >
        {item.label}
      </button>
    ))}
  </nav>
)

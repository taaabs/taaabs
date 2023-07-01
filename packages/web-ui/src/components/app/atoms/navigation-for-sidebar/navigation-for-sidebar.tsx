import styles from './navigation-for-sidebar.module.scss'
import cn from 'classnames'

export namespace NavigationForSidebarTypes {
  type NavigationItem = {
    label: string
    onClick: () => void
    isActive: boolean
  }
  export type Props = {
    navigationItems: NavigationItem[]
  }
}

export const NavigationForSidebar: React.FC<NavigationForSidebarTypes.Props> = (
  props,
) => {
  return (
    <nav className={styles.navigation}>
      {props.navigationItems.map((item, i) => (
        <button
          onClick={item.onClick}
          className={cn(styles.navigation__item, {
            [styles['navigation__item--active']]: item.isActive,
          })}
          key={i}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

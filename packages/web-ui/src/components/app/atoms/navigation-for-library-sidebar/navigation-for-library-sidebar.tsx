import styles from './navigation-for-library-sidebar.module.scss'
import cn from 'classnames'

export namespace NavigationForLibrarySidebar {
  type NavigationItem = {
    label: string
    onClick: () => void
    isActive: boolean
  }
  export type Props = {
    navigationItems: NavigationItem[]
  }
}

export const NavigationForLibrarySidebar: React.FC<
  NavigationForLibrarySidebar.Props
> = (props) => {
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

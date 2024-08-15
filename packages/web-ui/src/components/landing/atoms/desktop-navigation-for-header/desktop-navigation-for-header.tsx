import Link from 'next/link'
import styles from './desktop-navigation-for-header.module.scss'
import cn from 'classnames'

export namespace DesktopNavigationForHeader {
  type NavigationItem = {
    label: string
    href: string
    is_active: boolean
  }
  export type Props = {
    navigation_items: NavigationItem[]
  }
}

export const DesktopNavigationForHeader: React.FC<
  DesktopNavigationForHeader.Props
> = (props) => {
  return (
    <nav className={styles.navigation}>
      {props.navigation_items.map((item, i) => (
        <Link
          href={item.href}
          className={cn(styles.navigation__item, {
            [styles['navigation__item--active']]: item.is_active,
          })}
          key={i}
          title={item.label}
        >
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

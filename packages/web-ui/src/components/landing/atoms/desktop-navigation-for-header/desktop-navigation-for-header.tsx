import Link from 'next/link'
import styles from './desktop-navigation-for-header.module.scss'
import cn from 'classnames'

export namespace DesktopNavigationForHeader {
  type NavigationItem = {
    label: string
    href: string
    isActive: boolean
  }
  export type Props = {
    navigationItems: NavigationItem[]
  }
}

export const DesktopNavigationForHeader: React.FC<
  DesktopNavigationForHeader.Props
> = (props) => {
  return (
    <nav className={styles.navigation}>
      {props.navigationItems.map((item, i) => (
        <Link
          href={item.href}
          className={cn(styles.navigation__item, {
            [styles['navigation__item--active']]: item.isActive,
          })}
          key={i}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

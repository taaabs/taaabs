import Link from 'next/link'
import styles from './DesktopNavigationForHeader.module.scss'
import cn from 'classnames'

export namespace DesktopNavigationForHeaderTypes {
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
  DesktopNavigationForHeaderTypes.Props
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
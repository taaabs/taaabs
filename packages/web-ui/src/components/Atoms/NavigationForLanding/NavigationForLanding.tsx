import Link from 'next/link'
import styles from './NavigationForLanding.module.scss'
import cn from 'classnames'

export namespace NavigationForLandingTypes {
  type NavigationItem = {
    label: string
    href: string
    isActive: boolean
  }
  export type Props = {
    navigationItems: NavigationItem[]
  }
}

export const NavigationForLanding: React.FC<NavigationForLandingTypes.Props> = (
  props,
) => {
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

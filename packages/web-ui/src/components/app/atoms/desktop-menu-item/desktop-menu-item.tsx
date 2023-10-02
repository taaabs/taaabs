import Link from 'next/link'
import styles from './desktop-menu-item.module.scss'
import cn from 'classnames'

export namespace DesktopMenuItem {
  export type Props = {
    label: string
    href: string
    is_active: boolean
  }
}

export const DesktopMenuItem: React.FC<DesktopMenuItem.Props> = (props) => {
  return (
    <div
      className={cn(styles.container, {
        [styles['container--active']]: props.is_active,
      })}
    >
      <Link
        className={cn(styles.link, {
          [styles['link--active']]: props.is_active,
        })}
        href={props.href}
        title={props.label}
      >
        <span>{props.label}</span>
      </Link>
    </div>
  )
}

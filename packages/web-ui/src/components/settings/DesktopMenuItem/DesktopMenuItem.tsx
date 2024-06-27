import Link from 'next/link'
import styles from './DesktopMenuItem.module.scss'
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
    <Link
      className={cn(styles.link, {
        [styles['link--active']]: props.is_active,
      })}
      href={props.href}
    >
      <div
        className={cn(styles.link__inner, {
          [styles['link__inner--active']]: props.is_active,
        })}
        title={props.label}
      >
        <span>{props.label}</span>
      </div>
    </Link>
  )
}

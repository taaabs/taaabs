import Link from 'next/link'
import styles from './_Button.module.scss'
import cn from 'classnames'
import { Icon as UiIcon } from '@web-ui/components/Icon'

export namespace _Button {
  export type Props = {
    icon: UiIcon.Variant
    filled_icon: UiIcon.Variant
    href: string
    title: string
    on_click?: (e: React.MouseEvent) => void
    is_active: boolean
  }
}

export const _Button: React.FC<_Button.Props> = (props) => {
  return (
    <Link
      className={cn(styles.button, {
        [styles['button--active']]: props.is_active,
      })}
      href={props.href}
      onClick={props.on_click ? (e) => props.on_click!(e) : undefined}
      title={props.title}
    >
      <UiIcon variant={props.is_active ? props.filled_icon : props.icon} />
    </Link>
  )
}

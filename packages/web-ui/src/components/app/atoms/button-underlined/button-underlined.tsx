import Link from 'next/link'
import styles from './button-underlined.module.scss'
import cn from 'classnames'

export namespace ButtonUnderlined {
  export type Props = {
    label: string
    href?: string
    on_click?: () => void
    is_active: boolean
  }
}

export const ButtonUnderlined: React.FC<ButtonUnderlined.Props> = (props) => {
  if (props.href !== undefined) {
    return (
      <Link
        className={cn(styles.button, {
          [styles['button--active']]: props.is_active,
        })}
        href={props.href}
        title={props.label}
      >
        <span>{props.label}</span>
      </Link>
    )
  } else {
    return (
      <button
        className={cn(styles.button, {
          [styles['button--active']]: props.is_active,
        })}
        onClick={props.on_click}
        title={props.label}
        disabled={!props.on_click}
      >
        <span>{props.label}</span>
      </button>
    )
  }
}

import Link from 'next/link'
import styles from './ButtonUnderlined.module.scss'
import cn from 'classnames'

export namespace ButtonUnderlinedTypes {
  export type Props = {
    children: React.ReactNode
    href?: string
    onClick?: () => void
    isActive: boolean
  }
}

export const ButtonUnderlined: React.FC<ButtonUnderlinedTypes.Props> = (
  props,
) => {
  if (props.href != undefined) {
    return (
      <Link
        className={cn(styles.button, {
          [styles['button--active']]: props.isActive,
        })}
        href={props.href}
      >
        <span>{props.children}</span>
      </Link>
    )
  } else if (props.onClick != undefined) {
    return (
      <button
        className={cn(styles.button, styles['button-disabled'], {
          [styles['button--active']]: props.isActive,
        })}
        onClick={props.onClick}
      >
        <span>{props.children}</span>
      </button>
    )
  } else {
    return (
      <button
        className={cn(styles.button, styles['button-disabled'], {
          [styles['button--active']]: props.isActive,
        })}
        disabled
      >
        <span>{props.children}</span>
      </button>
    )
  }
}

import Link from 'next/link'
import styles from './button-underlined.module.scss'
import cn from 'classnames'

export namespace ButtonUnderlinedTypes {
  export type Props = {
    label: string
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
        title={props.label}
      >
        <span>{props.label}</span>
      </Link>
    )
  } else {
    return (
      <button
        className={cn(styles.button, {
          [styles['button--active']]: props.isActive,
        })}
        onClick={props.onClick}
        title={props.label}
        disabled={!props.onClick}
      >
        <span>{props.label}</span>
      </button>
    )
  }
}

import Link from 'next/link'
import styles from './ButtonUnderlined.module.scss'
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
  const label = (
    <>
      <span>{props.label}</span>
      <div
        className={cn(styles.boldTextWidthFix, {
          [styles['boldTextWidthFix--active']]: props.isActive,
        })}
      >
        {props.label}
      </div>
    </>
  )
  if (props.href != undefined) {
    return (
      <Link
        className={cn(styles.button, {
          [styles['button--active']]: props.isActive,
        })}
        href={props.href}
      >
        {label}
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
        {label}
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
        {label}
      </button>
    )
  }
}

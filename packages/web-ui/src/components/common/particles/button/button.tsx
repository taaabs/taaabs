import Link from 'next/link'
import styles from './button.module.scss'
import cn from 'classnames'

export namespace Button {
  export type Size = 'small' | 'default' | 'large'
  export type Props = {
    href?: string
    size?: Size
    onClick?: () => void
    type?: 'submit'
    children?: React.ReactNode
    ariaLabel?: string
    ariaLabelledby?: string
  }
}

export const Button = (props: Button.Props) => {
  if (props.type == 'submit') {
    return (
      <button
        className={cn(
          styles.button,
          styles[`button--${props.size ? props.size : 'default'}`],
        )}
        type="submit"
      >
        {props.children}
      </button>
    )
  } else if (props.href != undefined) {
    return (
      <Link
        className={cn(
          styles.button,
          styles[`button--${props.size ? props.size : 'default'}`],
        )}
        href={props.href}
        onClick={props.onClick}
      >
        {props.children}
      </Link>
    )
  } else if (props.onClick != undefined) {
    return (
      <button
        className={cn(
          styles.button,
          styles[`button--${props.size ? props.size : 'default'}`],
        )}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    )
  } else {
    return (
      <button
        className={cn(
          styles.button,
          styles[`button--${props.size ? props.size : 'default'}`],
        )}
        disabled
      >
        {props.children}
      </button>
    )
  }
}

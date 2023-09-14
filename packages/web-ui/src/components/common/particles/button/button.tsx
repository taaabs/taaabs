import Link from 'next/link'
import styles from './button.module.scss'
import cn from 'classnames'

export namespace Button {
  export type Size = 'small' | 'default' | 'large'
  export type Props = {
    href?: string
    size?: Size
    on_click?: () => void
    type?: 'submit'
    children?: React.ReactNode
    aria_label?: string
    aria_labelledby?: string
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
        onClick={props.on_click}
      >
        {props.children}
      </Link>
    )
  } else if (props.on_click != undefined) {
    return (
      <button
        className={cn(
          styles.button,
          styles[`button--${props.size ? props.size : 'default'}`],
        )}
        onClick={props.on_click}
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

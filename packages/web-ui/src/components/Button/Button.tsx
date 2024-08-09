import Link from 'next/link'
import styles from './Button.module.scss'
import cn from 'classnames'

export namespace Button {
  export type Size = 'small' | 'default' | 'medium' | 'large'
  export type Props = {
    href?: string
    size?: Size
    on_click?: () => void
    type?: 'submit'
    children?: React.ReactNode
    aria_label?: string
    aria_labelledby?: string
    is_disabled?: boolean
    is_danger?: boolean
    auto_focus?: boolean
  }
}

export const Button: React.FC<Button.Props> = (props) => {
  const class_names = cn([
    styles.container,
    props.size && props.size != 'default' && styles[`container--${props.size}`],
    { [styles['container--disabled']]: props.is_disabled },
    { [styles['container--danger']]: props.is_danger },
  ])

  if (props.type == 'submit') {
    return (
      <button
        className={class_names}
        type="submit"
        autoFocus={props.auto_focus}
      >
        <span>{props.children}</span>
      </button>
    )
  } else if (props.href !== undefined) {
    return (
      <Link
        className={class_names}
        href={props.href}
        onClick={props.on_click}
        autoFocus={props.auto_focus}
      >
        <span>{props.children}</span>
      </Link>
    )
  } else if (props.on_click !== undefined) {
    return (
      <button
        className={class_names}
        onClick={props.on_click}
        type="button"
        autoFocus={props.auto_focus}
      >
        <span>{props.children}</span>
      </button>
    )
  } else {
    return (
      <button className={class_names} disabled>
        <span>{props.children}</span>
      </button>
    )
  }
}

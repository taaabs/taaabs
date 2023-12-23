import Link from 'next/link'
import styles from './button.module.scss'
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
    is_loading?: boolean
    is_disabled?: boolean
  }
}

export const Button: React.FC<Button.Props> = (props) => {
  const class_names = cn([
    styles.container,
    styles[`container--${props.size ? props.size : 'default'}`],
    { [styles['container--loading']]: props.is_loading },
    { [styles['container--disabled']]: props.is_disabled },
  ])

  if (props.type == 'submit') {
    return (
      <button className={class_names} type="submit">
        {props.children}
      </button>
    )
  } else if (props.href !== undefined) {
    return (
      <Link className={class_names} href={props.href} onClick={props.on_click}>
        {props.children}
      </Link>
    )
  } else if (props.on_click !== undefined) {
    return (
      <button className={class_names} onClick={props.on_click} type="button">
        {props.children}
      </button>
    )
  } else {
    return (
      <button className={class_names} disabled>
        {props.children}
      </button>
    )
  }
}

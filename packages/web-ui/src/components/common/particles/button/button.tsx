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
    is_outlined?: boolean
  }
}

export const Button: React.FC<Button.Props> = (props) => {
  const class_names = cn([
    styles.container,
    styles[`container--${props.size ? props.size : 'default'}`],
    { [styles['container--outlined']]: props.is_outlined },
    { [styles['container--loading']]: props.is_loading },
    { [styles['container--disabled']]: props.is_disabled },
  ])

  if (props.type == 'submit') {
    return (
      <button className={class_names} type="submit">
        <span>{props.children}</span>
      </button>
    )
  } else if (props.href !== undefined) {
    return (
      <Link className={class_names} href={props.href} onClick={props.on_click}>
        <span>{props.children}</span>
      </Link>
    )
  } else if (props.on_click !== undefined) {
    return (
      <button className={class_names} onClick={props.on_click} type="button">
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

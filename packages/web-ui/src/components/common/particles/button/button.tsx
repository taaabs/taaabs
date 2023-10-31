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
    is_loading?: boolean
  }
}

export const Button: React.FC<Button.Props> = ({
  size = 'default',
  ...props
}) => {
  const classNames = cn([
    styles.container,
    styles[`container--${size}`],
    { [styles['container--is-loading']]: props.is_loading },
  ])

  if (props.type == 'submit') {
    return (
      <button className={classNames} type="submit">
        {props.children}
      </button>
    )
  } else if (props.href != undefined) {
    return (
      <Link className={classNames} href={props.href} onClick={props.on_click}>
        {props.children}
      </Link>
    )
  } else if (props.on_click != undefined) {
    return (
      <button className={classNames} onClick={props.on_click}>
        {props.children}
      </button>
    )
  } else {
    return (
      <button className={classNames} disabled>
        {props.children}
      </button>
    )
  }
}

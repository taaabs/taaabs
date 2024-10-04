import styles from './Button.module.scss'
import cn from 'classnames'

export namespace Button {
  export type Props = {
    href?: string
    is_outlined?: boolean
    on_click?: (e: any) => void
    is_disabled?: boolean
    is_danger?: boolean
    children?: React.ReactNode
    rel?: string
  }
}

export const Button: React.FC<Button.Props> = (props) => {
  const class_names = cn([
    styles.container,
    { [styles['container--disabled']]: props.is_disabled },
    { [styles['container--danger']]: props.is_danger },
    { [styles['container--outlined']]: props.is_outlined },
  ])

  if (props.href !== undefined) {
    return (
      <a
        className={class_names}
        href={props.href}
        onClick={props.on_click}
        rel={props.rel}
      >
        <span>{props.children}</span>
      </a>
    )
  } else {
    return (
      // We don't use <button> intentionally as these styles are often globally set
      <div className={class_names} onClick={props.on_click} role="button">
        <span>{props.children}</span>
      </div>
    )
  }
}

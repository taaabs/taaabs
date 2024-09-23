import styles from './StandardItem.module.scss'

export namespace StandardItem {
  export type Props = {
    label: string
    on_click?: () => void
    href?: string
  }
}

export const StandardItem: React.FC<StandardItem.Props> = (props) => {
  return props.on_click ? (
    <button className={styles.container} onClick={props.on_click}>
      {props.label}
    </button>
  ) : (
    <a className={styles.container} href={props.href}>
      {props.label}
    </a>
  )
}

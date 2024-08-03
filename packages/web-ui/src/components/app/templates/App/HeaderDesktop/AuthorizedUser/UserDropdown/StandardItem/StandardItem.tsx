import styles from './StandardItem.module.scss'

export namespace StandardItem {
  export type Props = {
    label: string
    on_click: () => void
  }
}

export const StandardItem: React.FC<StandardItem.Props> = (props) => {
  return (
    <button className={styles.container} onClick={props.on_click}>
      {props.label}
    </button>
  )
}

import styles from './FlexRow.scss'

export namespace FlexRow {
  export type Props = {
    children: React.ReactNode
  }
}

export const FlexRow: React.FC<FlexRow.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

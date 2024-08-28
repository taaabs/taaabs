import styles from './Actions.module.scss'

export namespace Actions {
  export type Props = {
    children: React.ReactNode
  }
}

export const Actions: React.FC<Actions.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

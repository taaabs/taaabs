import styles from './Content.module.scss'

export namespace Content {
  export type Props = {
    children?: React.ReactNode
  }
}

export const Content: React.FC<Content.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

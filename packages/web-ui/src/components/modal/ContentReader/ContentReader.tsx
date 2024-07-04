import styles from './ContentReader.module.scss'

export namespace ContentReader {
  export type Props = {
    children?: React.ReactNode
  }
}

export const ContentReader: React.FC<ContentReader.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

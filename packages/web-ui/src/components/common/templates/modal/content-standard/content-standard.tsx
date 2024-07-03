import styles from './content-standard.module.scss'

export namespace ContentStandard {
  export type Props = {
    children?: React.ReactNode
  }
}

export const ContentStandard: React.FC<ContentStandard.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

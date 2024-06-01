import styles from './standard-split.module.scss'

namespace StandardSplit {
  export type Props = {
    label: string
    children: React.ReactNode
  }
}

export const StandardSplit: React.FC<StandardSplit.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{props.label}</div>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
}

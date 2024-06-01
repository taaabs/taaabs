import styles from './standard.module.scss'

namespace Standard {
  export type Props = {
    label: string
    children: React.ReactNode
  }
}

export const Standard: React.FC<Standard.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{props.label}</div>
      <div>{props.children}</div>
    </div>
  )
}

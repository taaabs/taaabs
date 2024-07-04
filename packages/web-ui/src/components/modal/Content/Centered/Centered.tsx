import styles from './Centered.module.scss'

namespace Centered {
  export type Props = {
    label: string
    children: React.ReactNode
  }
}

export const Centered: React.FC<Centered.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{props.label}</div>
      <div>{props.children}</div>
    </div>
  )
}

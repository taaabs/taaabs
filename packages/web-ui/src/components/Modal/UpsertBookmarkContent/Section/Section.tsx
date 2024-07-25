import styles from './Section.module.scss'

namespace Section {
  export type Props = {
    label: string
    children: React.ReactNode
  }
}

export const Section: React.FC<Section.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{props.label}</div>
      <div>{props.children}</div>
    </div>
  )
}

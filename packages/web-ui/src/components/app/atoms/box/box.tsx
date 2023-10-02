import styles from './box.module.scss'

export namespace Box {
  export type Props = {
    children: React.ReactNode
  }
}

export const Box: React.FC<Box.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

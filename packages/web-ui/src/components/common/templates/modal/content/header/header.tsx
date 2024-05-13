import styles from './header.module.scss'

export namespace Header {
  export type Props = {
    title_: string
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.title_}</div>
    </div>
  )
}

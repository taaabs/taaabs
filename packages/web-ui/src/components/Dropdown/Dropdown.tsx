import styles from './Dropdown.module.scss'

export namespace Dropdown {
  export type Props = {
    children: React.ReactNode
  }
}

export const Dropdown: React.FC<Dropdown.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

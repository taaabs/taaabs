import styles from './user-dropdown.module.scss'

export namespace UserDropdown {
  export type Props = {
    children: React.ReactNode
  }
}

export const UserDropdown: React.FC<UserDropdown.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

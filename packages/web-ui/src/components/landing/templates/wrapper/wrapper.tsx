import styles from './wrapper.module.scss'

export const Wrapper: React.FC<{ children?: React.ReactNode }> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

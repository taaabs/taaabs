import styles from './wrapper.module.scss'

export const Wrapper: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>
}

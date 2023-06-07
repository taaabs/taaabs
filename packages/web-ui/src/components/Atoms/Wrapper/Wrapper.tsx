import styles from './Wrapper.module.scss'

export const Wrapper: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>
}

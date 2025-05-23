import styles from './storybook-margin.module.scss'

export const StorybookMargin: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

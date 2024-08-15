import styles from './Section.module.scss'

export const Section: React.FC<{ children?: React.ReactNode }> = (props) => {
  return <section className={styles.container}>{props.children}</section>
}

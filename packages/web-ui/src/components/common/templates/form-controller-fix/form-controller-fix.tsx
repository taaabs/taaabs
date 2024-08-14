import styles from './form-controller-fix.module.scss'

export const FormControllerFix: React.FC<{ children: React.ReactNode }> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

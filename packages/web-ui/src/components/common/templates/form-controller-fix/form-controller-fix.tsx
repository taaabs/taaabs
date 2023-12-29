import { ReactNode } from 'react'
import styles from './form-controller-fix.module.scss'

export const FormControllerFix: React.FC<{ children: ReactNode }> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

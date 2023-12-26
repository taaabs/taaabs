import styles from './form-radio.module.scss'

export const FormRadio: React.FC<{ children: React.ReactNode }> = (props) => {
  return <div className={styles.contanier}>{props.children}</div>
}

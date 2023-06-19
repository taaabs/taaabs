import styles from './_DesktopTitleBar.module.scss'

export namespace _DesktopTitleBarTypes {
  export type Props = {
    primaryText: string
    secondaryText: string
  }
}

export const _DesktopTitleBar: React.FC<_DesktopTitleBarTypes.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <span className={styles.primaryText}>{props.primaryText}</span>
      <span className={styles.secondaryText}>{props.secondaryText}</span>
    </div>
  )
}

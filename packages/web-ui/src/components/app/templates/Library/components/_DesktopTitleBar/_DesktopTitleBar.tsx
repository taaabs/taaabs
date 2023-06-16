import styles from './_DesktopTitlebar.module.scss'

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
      <span>{props.primaryText}</span>
      <span>{props.secondaryText}</span>
    </div>
  )
}

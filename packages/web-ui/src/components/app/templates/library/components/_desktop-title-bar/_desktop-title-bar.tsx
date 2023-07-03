import styles from './_desktop-title-bar.module.scss'

export namespace _DesktopTitleBarTypes {
  export type Props = {
    text?: {
      primary: string
      secondary: string
    }
  }
}

export const _DesktopTitleBar: React.FC<_DesktopTitleBarTypes.Props> = (
  props,
) => {
  return props.text ? (
    <div className={styles.container}>
      <span className={styles.primaryText}>{props.text.primary}</span>
      <span className={styles.secondaryText}>{props.text.secondary}</span>
    </div>
  ) : (
    <div>[SKELETON]</div>
  )
}

import Skeleton from 'react-loading-skeleton'
import styles from './_desktop-title-bar.module.scss'

export namespace _DesktopTitleBar {
  export type Props = {
    text?: {
      primary: string
      secondary: string
    }
  }
}

export const _DesktopTitleBar: React.FC<_DesktopTitleBar.Props> = (props) => {
  return props.text ? (
    <div className={styles.container}>
      <span className={styles.primaryText}>{props.text.primary}</span>
      <span className={styles.secondaryText}>{props.text.secondary}</span>
    </div>
  ) : (
    <div className={styles.skeleton}>
      <Skeleton borderRadius={999} />
    </div>
  )
}

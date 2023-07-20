import Skeleton from 'react-loading-skeleton'
import styles from './_desktop-title-bar.module.scss'

export namespace _DesktopTitleBar {
  export type Props = {
    text?: string
  }
}

export const _DesktopTitleBar: React.FC<_DesktopTitleBar.Props> = (props) => {
  return props.text ? (
    <div className={styles.container}>
      <span className={styles.text}>{props.text}</span>
    </div>
  ) : (
    <div className={styles.skeleton}>
      <Skeleton borderRadius={999} />
    </div>
  )
}

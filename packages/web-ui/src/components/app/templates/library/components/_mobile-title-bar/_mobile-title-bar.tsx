import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './_mobile-title-bar.module.scss'
import cn from 'classnames'
import Skeleton from 'react-loading-skeleton'

export namespace _MobileTitleBar {
  export type Props = {
    swipeLeftOnClick?: () => void
    swipeRightOnClick?: () => void
    text?: string
  }
}

export const _MobileTitleBar: React.FC<_MobileTitleBar.Props> = (props) => {
  return (
    <div className={styles.container}>
      <button
        className={cn(styles.icon, styles['icon--left'])}
        onClick={props.swipeLeftOnClick}
      >
        <Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      </button>

      {props.text ? (
        <div className={styles.content}>
          <span className={styles.content__text}>{props.text}</span>
        </div>
      ) : (
        <div className={styles.skeleton}>
          <Skeleton borderRadius={999} width={180} />
        </div>
      )}

      <button
        className={cn(styles.icon, styles['icon--right'])}
        onClick={props.swipeRightOnClick}
      >
        <Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      </button>
    </div>
  )
}

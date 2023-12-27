import { Ui } from '@web-ui'
import styles from './_mobile-title-bar.module.scss'
import cn from 'classnames'

export namespace _MobileTitleBar {
  export type Props = {
    swipe_left_on_click?: () => void
    swipe_right_on_click?: () => void
    text?: string
  }
}

export const _MobileTitleBar: React.FC<_MobileTitleBar.Props> = (props) => {
  return (
    <div className={styles.container}>
      <button
        className={cn(styles.icon, styles['icon--left'])}
        onClick={props.swipe_left_on_click}
      >
        <Ui.Common.Particles.Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      </button>

      {props.text && (
        <div className={styles.content}>
          <span className={styles.content__text}>{props.text}</span>
        </div>
      )}

      <button
        className={cn(styles.icon, styles['icon--right'])}
        onClick={props.swipe_right_on_click}
      >
        <Ui.Common.Particles.Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      </button>
    </div>
  )
}

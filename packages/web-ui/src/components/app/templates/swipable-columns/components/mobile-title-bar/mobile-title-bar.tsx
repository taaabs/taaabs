import styles from './mobile-title-bar.module.scss'
import cn from 'classnames'
import { Icon as UiCommonParticle_Icon } from '@web-ui/components/common/particles/icon'

export namespace MobileTitleBar {
  export type Props = {
    swipe_left_on_click?: () => void
    swipe_right_on_click?: () => void
    text?: string
  }
}

export const MobileTitleBar: React.FC<MobileTitleBar.Props> = (props) => {
  return (
    <div className={styles.container}>
      <button
        className={cn(styles.icon, styles['icon--left'])}
        onClick={props.swipe_left_on_click}
      >
        <UiCommonParticle_Icon variant={'MOBILE_TITLE_BAR_LEFT'} />
      </button>

      {props.text && <div className={styles.content}>{props.text}</div>}

      <button
        className={cn(styles.icon, styles['icon--right'])}
        onClick={props.swipe_right_on_click}
      >
        <UiCommonParticle_Icon variant={'MOBILE_TITLE_BAR_RIGHT'} />
      </button>
    </div>
  )
}
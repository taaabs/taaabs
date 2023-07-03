import { Icon } from '@web-ui/components/common/atoms/icon'
import styles from './_mobile-title-bar.module.scss'
import cn from 'classnames'

export namespace _MobileTitleBarTypes {
  export type Props = {
    swipeLeftOnClick?: () => void
    swipeRightOnClick?: () => void
    text?: {
      primary: string
      secondary: string
    }
  }
}

export const _MobileTitleBar: React.FC<_MobileTitleBarTypes.Props> = (
  props,
) => {
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
          <span className={styles.content__primaryText}>
            {props.text.primary}
          </span>
          <span className={styles.content__secondaryText}>
            {props.text.secondary}
          </span>
        </div>
      ) : (
        <div>[SKELETON]</div>
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

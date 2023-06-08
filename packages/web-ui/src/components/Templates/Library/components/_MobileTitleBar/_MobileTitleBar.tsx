import { Icon } from '@web-ui/components/Atoms/Icon'
import styles from './_MobileTitleBar.module.scss'
import cn from 'classnames'

export namespace _MobileTitleBarTypes {
  export type Props = {
    swipeLeftOnClick?: () => void
    swipeRightOnClick?: () => void
    topLineText: string
    bottomLineText: string
  }
}

export const _MobileTitleBar = (props: _MobileTitleBarTypes.Props) => {
  return (
    <div className={styles.container}>
      <button
        className={cn(styles.icon, styles['icon--left'])}
        onClick={props.swipeLeftOnClick}
      >
        <Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      </button>
      <div className={styles.title}>
        <span>{props.topLineText}</span>
        <span>{props.bottomLineText}</span>
      </div>
      <button
        className={cn(styles.icon, styles['icon--right'])}
        onClick={props.swipeRightOnClick}
      >
        <Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      </button>
    </div>
  )
}

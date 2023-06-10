import { Icon } from '@web-ui/components/Atoms/Icon'
import styles from './_MobileTitleBar.module.scss'
import cn from 'classnames'

export namespace _MobileTitleBarTypes {
  export type Props = {
    swipeLeftOnClick?: () => void
    swipeRightOnClick?: () => void
    primaryText: string
    secondaryText: string
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
      <div className={styles.content}>
        <span>{props.primaryText}</span>
        <span>{props.secondaryText}</span>
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

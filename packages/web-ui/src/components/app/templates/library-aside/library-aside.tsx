import { Icon } from '@web-ui/components/common/atoms/icon'
import styles from './library-aside.module.scss'
import cn from 'classnames'

export namespace LibraryAside {
  export type Props = {
    slotFilter?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      isDropdownVisible: boolean
    }
    slotSort?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      isDropdownVisible: boolean
    }
    slotDateRange?: React.ReactNode
    slotTags?: React.ReactNode
  }
}

export const LibraryAside: React.FC<LibraryAside.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div></div>
        <button className={styles.toolbar__menu}>
          <Icon variant="THREE_DOTS" />
        </button>
      </div>
      <div className={styles['sort-and-filtering']}>
        {props.slotFilter && (
          <div className={styles['sort-and-filtering__button']}>
            {props.slotFilter.button}
            <div
              className={cn([
                styles['sort-and-filtering__button__dropdown'],
                {
                  [styles['sort-and-filtering__button__dropdown--hidden']]:
                    !props.slotFilter.isDropdownVisible,
                },
              ])}
            >
              {props.slotFilter.dropdown}
            </div>
          </div>
        )}
        {props.slotSort && (
          <div className={styles['sort-and-filtering__button']}>
            {props.slotSort.button}
            <div
              className={cn([
                styles['sort-and-filtering__button__dropdown'],
                {
                  [styles['sort-and-filtering__button__dropdown--hidden']]:
                    !props.slotSort.isDropdownVisible,
                },
              ])}
            >
              {props.slotSort.dropdown}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

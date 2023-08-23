import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './library-aside.module.scss'
import cn from 'classnames'

export namespace LibraryAside {
  export type Props = {
    slotFilter?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      isDropdownVisible: boolean
    }
    slotSortBy?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      isDropdownVisible: boolean
    }
    slotSort?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      isDropdownVisible: boolean
    }
    slotMonths?: React.ReactNode
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
        {props.slotSortBy && (
          <div className={styles['sort-and-filtering__button']}>
            {props.slotSortBy.button}
            <div
              className={cn([
                styles['sort-and-filtering__button__dropdown'],
                {
                  [styles['sort-and-filtering__button__dropdown--hidden']]:
                    !props.slotSortBy.isDropdownVisible,
                },
              ])}
            >
              {props.slotSortBy.dropdown}
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
        {props.slotMonths}
        <div className={styles.tags}>{props.slotTags}</div>
      </div>
    </div>
  )
}

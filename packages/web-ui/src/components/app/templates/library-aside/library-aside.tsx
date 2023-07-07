import styles from './library-aside.module.scss'
import cn from 'classnames'

export namespace LibraryAsideTypes {
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

export const LibraryAside: React.FC<LibraryAsideTypes.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.slotFilter && (
        <div className={styles.button}>
          {props.slotFilter.button}
          <div
            className={cn([
              styles.button__dropdown,
              {
                [styles['button__dropdown--hidden']]:
                  !props.slotFilter.isDropdownVisible,
              },
            ])}
          >
            {props.slotFilter.dropdown}
          </div>
        </div>
      )}
      {props.slotSort && (
        <div className={styles.button}>
          {props.slotSort.button}
          <div
            className={cn([
              styles.button__dropdown,
              {
                [styles['button__dropdown--hidden']]:
                  !props.slotSort.isDropdownVisible,
              },
            ])}
          >
            {props.slotSort.dropdown}
          </div>
        </div>
      )}
    </div>
  )
}

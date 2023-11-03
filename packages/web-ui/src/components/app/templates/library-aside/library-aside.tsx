import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './library-aside.module.scss'
import cn from 'classnames'

export namespace LibraryAside {
  export type Props = {
    slot_filter?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      is_dropdown_visible: boolean
    }
    slot_sortby?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      is_dropdown_visible: boolean
    }
    slot_order?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      is_dropdown_visible: boolean
    }
    slot_months?: React.ReactNode
    slot_tags?: React.ReactNode
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
      <div className={styles['slots']}>
        {props.slot_filter && (
          <div className={styles['slots__button']}>
            {props.slot_filter.button}
            <div
              className={cn([
                styles['slots__button__dropdown'],
                {
                  [styles['slots__button__dropdown--hidden']]:
                    !props.slot_filter.is_dropdown_visible,
                },
              ])}
            >
              {props.slot_filter.dropdown}
            </div>
          </div>
        )}
        {props.slot_sortby && (
          <div className={styles['slots__button']}>
            {props.slot_sortby.button}
            <div
              className={cn([
                styles['slots__button__dropdown'],
                {
                  [styles['slots__button__dropdown--hidden']]:
                    !props.slot_sortby.is_dropdown_visible,
                },
              ])}
            >
              {props.slot_sortby.dropdown}
            </div>
          </div>
        )}
        {props.slot_order && (
          <div className={styles['slots__button']}>
            {props.slot_order.button}
            <div
              className={cn([
                styles['slots__button__dropdown'],
                {
                  [styles['slots__button__dropdown--hidden']]:
                    !props.slot_order.is_dropdown_visible,
                },
              ])}
            >
              {props.slot_order.dropdown}
            </div>
          </div>
        )}
        {props.slot_months}
        <div className={styles.tags}>{props.slot_tags}</div>
      </div>
    </div>
  )
}

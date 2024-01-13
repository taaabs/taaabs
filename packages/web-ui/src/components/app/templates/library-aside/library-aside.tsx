import styles from './library-aside.module.scss'
import cn from 'classnames'
import { Icon } from '@web-ui/components/common/particles/icon'

export namespace LibraryAside {
  export type Props = {
    density_on_click?: () => void
    density: 'default' | 'compact'
    slot_filter?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      is_dropdown_visible: boolean
    }
    slot_sort_by?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      is_dropdown_visible: boolean
    }
    slot_order?: {
      button: React.ReactNode
      dropdown: React.ReactNode
      is_dropdown_visible: boolean
    }
    slot_custom_range?: React.ReactNode
    slot_tags?: React.ReactNode
  }
}

export const LibraryAside: React.FC<LibraryAside.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button
          className={cn(styles.toolbar__button, {
            [styles['toolbar__button--disabled']]: !props.density_on_click,
          })}
          onClick={props.density_on_click}
        >
          <Icon
            variant={
              props.density == 'default' ? 'DENSITY_DEFAULT' : 'DENSITY_COMPACT'
            }
          />
        </button>
        <button className={styles.toolbar__button}>
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
        {props.slot_sort_by && (
          <div className={styles['slots__button']}>
            {props.slot_sort_by.button}
            <div
              className={cn([
                styles['slots__button__dropdown'],
                {
                  [styles['slots__button__dropdown--hidden']]:
                    !props.slot_sort_by.is_dropdown_visible,
                },
              ])}
            >
              {props.slot_sort_by.dropdown}
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
        {props.slot_custom_range}
        <div className={styles.tags}>{props.slot_tags}</div>
      </div>
    </div>
  )
}

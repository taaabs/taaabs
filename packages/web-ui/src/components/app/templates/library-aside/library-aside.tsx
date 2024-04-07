import { shared_values } from '@web-ui/constants'
import styles from './library-aside.module.scss'
import cn from 'classnames'
import StickyBox from 'react-sticky-box'

export namespace LibraryAside {
  export type Props = {
    on_feedback_click: () => void
    feedback_label: string
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
    <div className={styles.stickybox}>
      <StickyBox offsetTop={shared_values.app_header_desktop}>
        <div className={styles.container}>
          <div className={styles.feedback}>
            <button onClick={props.on_feedback_click}>
              {props.feedback_label}
            </button>
          </div>
          <div className={styles.slots}>
            {props.slot_sort_by && (
              <div className={styles.slots__button}>
                {props.slot_sort_by.button}
                <div
                  className={cn([
                    styles.slots__button__dropdown,
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
              <div className={styles.slots__button}>
                {props.slot_order.button}
                <div
                  className={cn([
                    styles.slots__button__dropdown,
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
      </StickyBox>
    </div>
  )
}

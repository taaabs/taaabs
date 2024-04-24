import { shared_values } from '@web-ui/constants'
import styles from './library-aside.module.scss'
import StickyBox from 'react-sticky-box'

export namespace LibraryAside {
  export type Props = {
    on_feedback_click: () => void
    feedback_label: string
    slot_segmented_buttons: React.ReactNode
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
            <div>{props.slot_segmented_buttons}</div>
            {props.slot_custom_range}
            <div className={styles.tags}>{props.slot_tags}</div>
          </div>
        </div>
      </StickyBox>
    </div>
  )
}

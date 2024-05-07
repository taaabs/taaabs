import { shared_values } from '@web-ui/constants'
import styles from './library-aside.module.scss'
import StickyBox from 'react-sticky-box'

export namespace LibraryAside {
  export type Props = {
    support_href_: string
    support_label_: string
    slot_segmented_buttons_: React.ReactNode
    slot_custom_range_?: React.ReactNode
    slot_tags_?: React.ReactNode
  }
}

export const LibraryAside: React.FC<LibraryAside.Props> = (props) => {
  return (
    <div className={styles.stickybox}>
      <StickyBox offsetTop={shared_values.app_header_desktop}>
        <div className={styles.container}>
          <div className={styles.feedback}>
            <a href={props.support_href_}>{props.support_label_}</a>
          </div>
          <div className={styles.slots}>
            {props.slot_segmented_buttons_}
            {props.slot_custom_range_}
            <div className={styles.tags}>{props.slot_tags_}</div>
          </div>
        </div>
      </StickyBox>
    </div>
  )
}

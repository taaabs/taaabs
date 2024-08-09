import { shared_values } from '@web-ui/constants'
import styles from './LibraryAside.module.scss'
import StickyBox from 'react-sticky-box'

export namespace LibraryAside {
  export type Props = {
    support_href: string
    support_label: string
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
            <a href={props.support_href} target="_blank">
              {props.support_label}
            </a>
          </div>
          <div className={styles.slots}>
            {props.slot_segmented_buttons}
            {props.slot_custom_range}
            <div className={styles.tags}>{props.slot_tags}</div>
          </div>
        </div>
      </StickyBox>
    </div>
  )
}

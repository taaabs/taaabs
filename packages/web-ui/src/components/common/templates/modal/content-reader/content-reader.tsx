import { useRef } from 'react'
import styles from './content-reader.module.scss'
import SimpleBar from 'simplebar-react'

export namespace ContentReader {
  export type Props = {
    children?: React.ReactNode
    slot_left_panel: React.ReactNode
    slot_right_panel: React.ReactNode
  }
}

export const ContentReader: React.FC<ContentReader.Props> = (props) => {
  const simplebar = useRef<any>(null)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.panel}>{props.slot_left_panel}</div>

        <div className={styles.main}>
          <SimpleBar className={styles.simplebar} ref={simplebar}>
            <div className={styles.simplebar__inner}>{props.children}</div>
          </SimpleBar>
        </div>

        <div className={styles.panel}>{props.slot_right_panel}</div>
      </div>
    </div>
  )
}

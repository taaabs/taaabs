import { Wrapper } from '@web-ui/components/common/templates/wrapper'
import styles from './HeaderDesktop.module.scss'

export namespace HeaderDesktop {
  export type Props = {
    slot_logo: React.ReactNode
    slot_navigation: React.ReactNode
    slot_right_side?: React.ReactNode
    translations: {
      powered_by: string
    }
  }
}

export const HeaderDesktop = (props: HeaderDesktop.Props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          <div className={styles.left}>{props.slot_logo}</div>
          <div className={styles.navigation}>{props.slot_navigation}</div>
          {props.slot_right_side}
        </div>
      </Wrapper>
    </div>
  )
}

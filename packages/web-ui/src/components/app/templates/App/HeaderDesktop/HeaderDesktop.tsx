import { Wrapper as UiWrapper } from '@web-ui/components/Wrapper'
import styles from './HeaderDesktop.module.scss'

export namespace HeaderDesktop {
  export type Props = {
    slot_left: React.ReactNode
    slot_middle: React.ReactNode
    slot_right: React.ReactNode
  }
}

export const HeaderDesktop = (props: HeaderDesktop.Props) => {
  return (
    <div className={styles.container}>
      <UiWrapper>
        <div className={styles.inner}>
          {props.slot_left}
          <div className={styles.navigation}>{props.slot_middle}</div>
          {props.slot_right}
        </div>
      </UiWrapper>
    </div>
  )
}

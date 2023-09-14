import { Wrapper } from '@web-ui/components/common/particles/wrapper'
import styles from './app-header-desktop.module.scss'

export namespace AppHeaderDesktop {
  export type Props = {
    slot_left_side_logo: React.ReactNode
    slot_left_side_navigation: React.ReactNode
    slot_right_side: React.ReactNode
  }
}

export const AppHeaderDesktop = (props: AppHeaderDesktop.Props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          <div className={styles.inner__left}>
            {props.slot_left_side_logo}
            {props.slot_left_side_navigation}
          </div>
          {props.slot_right_side}
        </div>
      </Wrapper>
    </div>
  )
}

import { Wrapper } from '@web-ui/components/common/templates/wrapper'
import styles from './app-header-desktop.module.scss'

export namespace AppHeaderDesktop {
  export type Props = {
    slot_logo: React.ReactNode
    slot_navigation: React.ReactNode
    slot_right_side: React.ReactNode
  }
}

export const AppHeaderDesktop = (props: AppHeaderDesktop.Props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          {props.slot_logo}
          <div className={styles.inner__navigation}>
            {props.slot_navigation}
          </div>
          {props.slot_right_side}
        </div>
      </Wrapper>
    </div>
  )
}

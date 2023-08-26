import { Wrapper } from '@web-ui/components/common/particles/wrapper'
import styles from './app-header-desktop.module.scss'

export namespace AppHeaderDesktop {
  export type Props = {
    logoSlot: React.ReactNode
    navigationSlot: React.ReactNode
    rightSideSlot: React.ReactNode
  }
}

export const AppHeaderDesktop = (props: AppHeaderDesktop.Props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          <div className={styles.inner__left}>
            {props.logoSlot}
            {props.navigationSlot}
          </div>
          {props.rightSideSlot}
        </div>
      </Wrapper>
    </div>
  )
}

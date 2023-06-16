import { Wrapper } from '@web-ui/components/app/atoms/Wrapper'
import styles from './AppHeaderDesktop.module.scss'

export namespace AppHeaderDesktopTypes {
  export type Props = {
    logoSlot: React.ReactNode
    navigationSlot: React.ReactNode
    rightSideSlot: React.ReactNode
  }
}

export const AppHeaderDesktop = (props: AppHeaderDesktopTypes.Props) => {
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

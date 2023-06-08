import { Wrapper } from '@web-ui/components/Atoms/Wrapper'
import styles from './HeaderDesktop.module.scss'

export namespace HeaderDesktopTypes {
  export type Props = {
    logoSlot: React.ReactNode
    navigationSlot: React.ReactNode
    rightSideSlot: React.ReactNode
  }
}

export const HeaderDesktop = (props: HeaderDesktopTypes.Props) => {
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

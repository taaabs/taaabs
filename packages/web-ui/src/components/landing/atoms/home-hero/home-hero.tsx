import { Wrapper } from '@web-ui/components/common/particles/wrapper'
import styles from './home-hero.module.scss'

export namespace HomeHero {
  export type Props = {
    heading: string
    subheading: React.ReactNode
  }
}

export const HomeHero: React.FC<HomeHero.Props> = (props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          <h1>{props.heading}</h1>
          <div className={styles.inner__subheading}>{props.subheading}</div>
        </div>
      </Wrapper>
    </div>
  )
}

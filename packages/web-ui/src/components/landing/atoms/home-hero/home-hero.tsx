import { Wrapper } from '../../particles/wrapper'
import styles from './home-hero.module.scss'
import { Button } from '@web-ui/components/common/particles/button'

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
          <div className={styles.inner__button}>
            <Button size="large">Get started for free</Button>
          </div>
        </div>
      </Wrapper>
    </div>
  )
}

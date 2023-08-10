import { Wrapper } from '@web-ui/components/app/atoms/wrapper'
import styles from './page-hero.module.scss'

export namespace PageHero {
  export type Props = {
    heading: string
    subheading: React.ReactNode
  }
}

export const PageHero: React.FC<PageHero.Props> = (props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          <h1>{props.heading}</h1>
          <p>{props.subheading}</p>
        </div>
      </Wrapper>
    </div>
  )
}

import { Ui } from '@web-ui'
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
      <Ui.Common.Templates.Wrapper>
        <div className={styles.inner}>
          <h1>{props.heading}</h1>
          <p>{props.subheading}</p>
        </div>
      </Ui.Common.Templates.Wrapper>
    </div>
  )
}

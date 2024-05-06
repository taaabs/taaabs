import { Wrapper as UiCommonTemplate_Wrapper } from '@web-ui/components/common/templates/wrapper'
import styles from './page-hero.module.scss'

export namespace PageHero {
  export type Props = {
    text: string
    subtext: React.ReactNode
  }
}

export const PageHero: React.FC<PageHero.Props> = (props) => {
  return (
    <div className={styles.container}>
      <UiCommonTemplate_Wrapper>
        <div className={styles.inner}>
          <h1>{props.text}</h1>
          <p>{props.subtext}</p>
        </div>
      </UiCommonTemplate_Wrapper>
    </div>
  )
}

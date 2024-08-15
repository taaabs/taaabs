import { Wrapper as UiWrapper } from '@web-ui/components/Wrapper'
import styles from './PageHero.module.scss'

export namespace PageHero {
  export type Props = {
    text: string
    subtext: React.ReactNode
  }
}

export const PageHero: React.FC<PageHero.Props> = (props) => {
  return (
    <div className={styles.container}>
      <UiWrapper>
        <div className={styles.inner}>
          <h1>{props.text}</h1>
          <p>{props.subtext}</p>
        </div>
      </UiWrapper>
    </div>
  )
}

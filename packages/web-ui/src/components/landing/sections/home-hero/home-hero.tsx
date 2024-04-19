import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './home-hero.module.scss'
import { Button } from '@web-ui/components/common/particles/button'
import { Wrapper as UiLandingTemplate_Wrapper } from '../../templates/wrapper/wrapper'

export namespace HomeHero {
  export type Props = {
    heading: {
      first_line: string
      second_line: string
    }
    subheading: React.ReactNode
    username: string
    on_username_change: (username: string) => void
    claim_username_placeholder: string
    claim_username_button_label: string
    on_claim_username_button_click: () => void
    ticks: React.ReactNode[]
  }
}

export const HomeHero: React.FC<HomeHero.Props> = (props) => {
  return (
    <div className={styles.container}>
      <UiLandingTemplate_Wrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.top__logo}>
              <Icon variant="LOGO" />
            </div>

            <h1 className={styles.top__heading}>
              <div className={styles['top__heading__first-line']}>
                <span>{props.heading.first_line}</span>
                <div
                  className={styles['top__heading__first-line__hugging-face']}
                >
                  <Icon variant="HUGGING_FACE" />
                </div>
              </div>
              <span>{props.heading.second_line}</span>
            </h1>

            <p className={styles.top__subheading}>{props.subheading}</p>
          </div>

          <div className={styles['claim-username']}>
            <div className={styles['claim-username__input']}>
              <input
                value={props.username}
                placeholder={props.claim_username_placeholder}
                onChange={(e) => props.on_username_change(e.target.value)}
              />
            </div>
            <Button
              on_click={props.on_claim_username_button_click}
              size="large"
            >
              {props.claim_username_button_label}
            </Button>
          </div>

          <div className={styles.checks}>
            {props.ticks.map((tick, i) => (
              <div className={styles.checks__item} key={i}>
                <Icon variant="CHECK" />
                <span>{tick}</span>
              </div>
            ))}
          </div>
        </div>
      </UiLandingTemplate_Wrapper>
    </div>
  )
}

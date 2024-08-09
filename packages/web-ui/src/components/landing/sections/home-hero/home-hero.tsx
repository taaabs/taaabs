import { Icon as UiIcon } from '@web-ui/components/Icon'
import styles from './home-hero.module.scss'
import { Button } from '@web-ui/components/Button'
import { Wrapper as UiLandingTemplate_Wrapper } from '../../templates/wrapper/wrapper'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

export namespace HomeHero {
  export type Props = {
    heading: {
      first_line: string
      second_line: string
    }
    subheading: React.ReactNode
    on_username_change: (username: string) => void
    claim_username?: {
      username: string
      placeholder: string
      button_label: string
      button_on_click: () => void
      incentive: string
    }
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
              <UiIcon variant="LOGO" />
            </div>

            <h1 className={styles.top__heading}>
              <div className={styles['top__heading__first-line']}>
                <span>{props.heading.first_line}</span>
                <div
                  className={styles['top__heading__first-line__hugging-face']}
                  onClick={(e) => {
                    confetti({
                      particleCount: 60,
                      startVelocity: 20,
                      spread: 200,
                      gravity: 0.3,
                      ticks: 30,
                      decay: 0.91,
                      scalar: 1.4,
                      shapes: ['square'],
                      colors: ['#FFD21E', '#1d4ed8'],
                      origin: {
                        x: e.clientX / window.innerWidth,
                        y: e.clientY / window.innerHeight,
                      },
                    })
                  }}
                >
                  <UiIcon variant="HUGGING_FACE" />
                </div>
              </div>
              <span>{props.heading.second_line}</span>
            </h1>

            <p className={styles.top__subheading}>{props.subheading}</p>
          </div>

          {props.claim_username && (
            <form
              className={styles['claim-username']}
              onSubmit={(e) => {
                e.preventDefault()
                props.claim_username?.button_on_click()
              }}
            >
              <div className={styles['claim-username__input']}>
                <input
                  value={props.claim_username.username}
                  placeholder={props.claim_username.placeholder}
                  onChange={(e) => props.on_username_change(e.target.value)}
                />
              </div>
              <div className={styles['claim-username__button']}>
                <Button type="submit" size="large">
                  {props.claim_username.button_label}
                </Button>
                <div className={styles['claim-username__button__incentive']}>
                  {props.claim_username.incentive}
                </div>
              </div>
            </form>
          )}

          <div className={styles.checks}>
            {props.ticks.map((tick, i) => (
              <div className={styles.checks__item} key={i}>
                <UiIcon variant="CHECK" />
                <span>{tick}</span>
              </div>
            ))}
          </div>
        </div>
      </UiLandingTemplate_Wrapper>
    </div>
  )
}

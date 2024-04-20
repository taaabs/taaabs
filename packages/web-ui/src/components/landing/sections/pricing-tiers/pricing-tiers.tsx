import styles from './pricing-tiers.module.scss'
import { Wrapper } from '@web-ui/components/common/templates/wrapper'
import { Icon } from '@web-ui/components/common/particles/icon'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { use_is_hydrated } from '@shared/hooks'
import confetti from 'canvas-confetti'

export namespace PricingTiers {
  export type Props = {
    billing_cycle: {
      labels: {
        monthly: string
        yearly: string
      }
      yearly_savings: string
      is_monthly_selected: boolean
      on_click: () => void
    }
    pricing_tiers: {
      name: string
      description: string
      price: string
      price_info?: {
        first_line: string
        second_line: string
      }
      bullets_heading: string
      bullets: string[]
      has_best_value?: boolean
      slot_button: React.ReactNode
    }[]
  }
}

export const PricingTiers: React.FC<PricingTiers.Props> = (props) => {
  const monthly = useRef<HTMLDivElement>(null)
  const yearly = useRef<HTMLDivElement>(null)
  const is_hydrated = use_is_hydrated()

  const [monthly_width, set_monthly_width] = useState<number>()
  const [yearly_width, set_yearly_width] = useState<number>()

  useEffect(() => {
    set_monthly_width(monthly.current!.getBoundingClientRect().width)
    set_yearly_width(yearly.current!.getBoundingClientRect().width)
  }, [])

  return (
    <section className={styles.container}>
      <Wrapper>
        <div className={styles['billing-cycle']}>
          <button
            className={styles['billing-cycle__box']}
            onClick={(e) => {
              props.billing_cycle.on_click()
              if (props.billing_cycle.is_monthly_selected) {
                confetti({
                  particleCount: 100,
                  startVelocity: 26,
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
              }
            }}
          >
            <div
              className={styles['billing-cycle__box__selection']}
              style={{
                width: props.billing_cycle.is_monthly_selected
                  ? monthly_width
                  : yearly_width,
                transform: props.billing_cycle.is_monthly_selected
                  ? `translateX(-${yearly_width}px)`
                  : undefined,
              }}
            />
            <div
              ref={monthly}
              className={cn(styles['billing-cycle__box__option'], {
                [styles['billing-cycle__box__option--selected']]:
                  is_hydrated && props.billing_cycle.is_monthly_selected,
              })}
            >
              {props.billing_cycle.labels.monthly}
            </div>
            <div
              ref={yearly}
              className={cn(styles['billing-cycle__box__option'], {
                [styles['billing-cycle__box__option--selected']]:
                  is_hydrated && !props.billing_cycle.is_monthly_selected,
              })}
            >
              <span>{props.billing_cycle.labels.yearly}</span>
              <div
                className={cn(
                  styles['billing-cycle__box__option__yearly-savings'],
                  {
                    [styles[
                      'billing-cycle__box__option__yearly-savings--selected'
                    ]]: !props.billing_cycle.is_monthly_selected,
                  },
                )}
              >
                {props.billing_cycle.yearly_savings}
              </div>
            </div>
          </button>
        </div>
        <div className={styles.tiers}>
          {props.pricing_tiers.map((pricing_tier) => (
            <div
              className={cn(styles.pricing_tier, {
                [styles['pricing_tier--best-value']]:
                  pricing_tier.has_best_value,
              })}
            >
              <div className={styles.pricing_tier__top}>
                <div className={styles.pricing_tier__top__name}>
                  {pricing_tier.name}
                </div>
                <div className={styles.pricing_tier__top__description}>
                  {pricing_tier.description}
                </div>
              </div>
              <div className={styles.pricing_tier__price}>
                <div className={styles.pricing_tier__price__cost}>
                  {pricing_tier.price}
                </div>
                {pricing_tier.price_info && (
                  <div className={styles.pricing_tier__price__info}>
                    <span>{pricing_tier.price_info.first_line}</span>
                    <span>{pricing_tier.price_info.second_line}</span>
                  </div>
                )}
              </div>
              <div className={styles.pricing_tier__bullets}>
                <h4 className={styles.pricing_tier__bullets__heading}>
                  {pricing_tier.bullets_heading}
                </h4>
                <div className={styles.pricing_tier__bullets__inner}>
                  {pricing_tier.bullets.map((bullet, i) => (
                    <div
                      className={styles.pricing_tier__bullets__inner__item}
                      key={i}
                    >
                      <div
                        className={
                          styles.pricing_tier__bullets__inner__item__check
                        }
                      >
                        <Icon variant="SELECTED_BOLD" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.pricing_tier__button}>
                {pricing_tier.slot_button}
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  )
}

import styles from './pricing-tiers.module.scss'
import { Wrapper as UiCommonTemplateWrapper } from '@web-ui/components/common/templates/wrapper'
import { Icon as UiIcon } from '@web-ui/components/Icon'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { Section as UiLandingTemplate_Section } from '../../templates/section/section'
import useWindowResize from 'beautiful-react-hooks/useWindowResize'

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
      previous_price?: string
      price_info?: {
        first_line: string
        second_line: string
      }
      bullets_heading: string
      bullets: string[]
      featured_text?: string
      slot_button: React.ReactNode
    }[]
  }
}

export const PricingTiers: React.FC<PricingTiers.Props> = (props) => {
  const on_window_resize = useWindowResize()
  const monthly = useRef<HTMLDivElement>(null)
  const yearly = useRef<HTMLDivElement>(null)

  const [monthly_width, set_monthly_width] = useState<number>()
  const [yearly_width, set_yearly_width] = useState<number>()

  on_window_resize(() => {
    set_monthly_width(monthly.current!.getBoundingClientRect().width)
    set_yearly_width(yearly.current!.getBoundingClientRect().width)
  })

  useEffect(() => {
    set_monthly_width(monthly.current!.getBoundingClientRect().width)
    set_yearly_width(yearly.current!.getBoundingClientRect().width)
  }, [])

  return (
    <UiLandingTemplate_Section>
      <UiCommonTemplateWrapper>
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
            {yearly_width && (
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
            )}
            <div
              ref={monthly}
              className={cn(styles['billing-cycle__box__option'], {
                [styles['billing-cycle__box__option--selected']]:
                  props.billing_cycle.is_monthly_selected,
              })}
            >
              <span title={props.billing_cycle.labels.monthly}>
                {props.billing_cycle.labels.monthly}
              </span>
            </div>
            <div
              ref={yearly}
              className={cn(styles['billing-cycle__box__option'], {
                [styles['billing-cycle__box__option--selected']]:
                  !props.billing_cycle.is_monthly_selected,
              })}
            >
              <span title={props.billing_cycle.labels.yearly}>
                {props.billing_cycle.labels.yearly}
              </span>
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
          {props.pricing_tiers.map((pricing_tier, i) => (
            <div
              className={cn(styles.pricing_tier, {
                [styles['pricing_tier--best-value']]:
                  pricing_tier.featured_text,
              })}
              featured-text={pricing_tier.featured_text}
              key={i}
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
                {pricing_tier.previous_price && (
                  <div
                    className={cn(
                      styles.pricing_tier__price__cost,
                      styles['pricing_tier__price__cost--previous'],
                    )}
                  >
                    {pricing_tier.previous_price}
                  </div>
                )}
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
                        <UiIcon variant="SELECTED_BOLD" />
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
      </UiCommonTemplateWrapper>
    </UiLandingTemplate_Section>
  )
}

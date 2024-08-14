'use client'

import { PageHero as UiLandingSection_PageHero } from '@web-ui/components/landing/sections/page-hero'
import { PricingTiers as UiLandingSectionPricingTiers } from '@web-ui/components/landing/sections/pricing-tiers'
import { Button as UiButton } from '@web-ui/components/Button'
import { useState } from 'react'
import { Dictionary } from '@/dictionaries/dictionary'

enum BillingCycle {
  MONTHLY,
  YEARLY,
}

const price = {
  monthly: {
    lite: 5,
    pro: 10,
  },
  yearly: {
    lite: 4,
    pro: 8,
  },
}

const Pricing: React.FC<{ dictionary: Dictionary }> = (props) => {
  const [billing_cycle, set_billing_cycle] = useState<BillingCycle>(
    BillingCycle.YEARLY,
  )

  let lite_price: number
  switch (billing_cycle) {
    case BillingCycle.YEARLY:
      lite_price = price.yearly.lite
      break
    case BillingCycle.MONTHLY:
      lite_price = price.monthly.lite
      break
  }

  let pro_price: number
  switch (billing_cycle) {
    case BillingCycle.YEARLY:
      pro_price = price.yearly.pro
      break
    case BillingCycle.MONTHLY:
      pro_price = price.monthly.pro
      break
  }

  return (
    <>
      <UiLandingSection_PageHero
        text={props.dictionary.landing.pricing.hero.text}
        subtext={props.dictionary.landing.pricing.hero.subtext}
      />
      <UiLandingSectionPricingTiers
        billing_cycle={{
          labels: {
            monthly: props.dictionary.landing.pricing.monthly,
            yearly: props.dictionary.landing.pricing.yearly,
          },
          on_click: () => {
            if (billing_cycle == BillingCycle.MONTHLY) {
              set_billing_cycle(BillingCycle.YEARLY)
            } else {
              set_billing_cycle(BillingCycle.MONTHLY)
            }
          },
          is_monthly_selected: billing_cycle == BillingCycle.MONTHLY,
          yearly_savings: '-20%',
        }}
        pricing_tiers={[
          {
            name: props.dictionary.landing.pricing.tiers[0].name,
            description: props.dictionary.landing.pricing.tiers[0].description,
            price: '$0',
            bullets_heading:
              props.dictionary.landing.pricing.tiers[0].bullets_heading,
            bullets: props.dictionary.landing.pricing.tiers[0].bullets,
            slot_button: (
              <UiButton on_click={() => {}} size="medium">
                {props.dictionary.landing.pricing.tiers[0].button_label}
              </UiButton>
            ),
          },
          {
            name: props.dictionary.landing.pricing.tiers[1].name,
            description: props.dictionary.landing.pricing.tiers[1].description,
            previous_price:
              billing_cycle == BillingCycle.YEARLY
                ? `$${price.monthly.lite}`
                : undefined,
            price: `$${lite_price}`,
            price_info: {
              first_line: props.dictionary.landing.pricing.per_month,
              second_line:
                billing_cycle == BillingCycle.YEARLY
                  ? props.dictionary.landing.pricing.billed_yearly
                  : props.dictionary.landing.pricing.billed_monthly,
            },
            bullets_heading:
              props.dictionary.landing.pricing.tiers[1].bullets_heading,
            bullets: props.dictionary.landing.pricing.tiers[1].bullets,
            slot_button: (
              <UiButton on_click={() => {}} size="medium">
                {props.dictionary.landing.pricing.tiers[1].button_label}
              </UiButton>
            ),
          },
          {
            name: props.dictionary.landing.pricing.tiers[2].name,
            description: props.dictionary.landing.pricing.tiers[2].description,
            previous_price:
              billing_cycle == BillingCycle.YEARLY
                ? `$${price.monthly.pro}`
                : undefined,
            price: `$${pro_price}`,
            price_info: {
              first_line: props.dictionary.landing.pricing.per_month,
              second_line:
                billing_cycle == BillingCycle.YEARLY
                  ? props.dictionary.landing.pricing.billed_yearly
                  : props.dictionary.landing.pricing.billed_monthly,
            },
            bullets_heading:
              props.dictionary.landing.pricing.tiers[2].bullets_heading,
            bullets: props.dictionary.landing.pricing.tiers[2].bullets,
            featured_text:
              props.dictionary.landing.pricing.tiers[2].featured_text,
            slot_button: (
              <UiButton on_click={() => {}} size="medium">
                {props.dictionary.landing.pricing.tiers[2].button_label}
              </UiButton>
            ),
          },
        ]}
      />
    </>
  )
}

export default Pricing

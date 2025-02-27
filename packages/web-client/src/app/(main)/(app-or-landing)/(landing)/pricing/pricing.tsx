'use client'

import { PageHero as Ui_landing_sections_PageHero } from '@web-ui/components/landing/sections/PageHero'
import { PricingTiers as Ui_landing_sections_PricingTiers } from '@web-ui/components/landing/sections/PricingTiers'
import { Button as UiButton } from '@web-ui/components/Button'
import { useState } from 'react'
import { Dictionary } from '@/dictionaries/dictionary'

enum BillingCycle {
  MONTHLY,
  YEARLY,
}

const price = {
  monthly: 4,
  yearly: 3.33,
}

const Pricing: React.FC<{ dictionary: Dictionary }> = (props) => {
  const [billing_cycle, set_billing_cycle] = useState<BillingCycle>(
    BillingCycle.YEARLY,
  )

  let pro_price: number
  switch (billing_cycle) {
    case BillingCycle.YEARLY:
      pro_price = price.yearly
      break
    case BillingCycle.MONTHLY:
      pro_price = price.monthly
      break
  }

  return (
    <>
      <Ui_landing_sections_PageHero
        text={props.dictionary.landing.pricing.hero.text}
        subtext={props.dictionary.landing.pricing.hero.subtext}
      />
      <Ui_landing_sections_PricingTiers
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
          yearly_savings: '2 months free!',
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
            featured_text: 'Membership',
            previous_price:
              billing_cycle == BillingCycle.YEARLY
                ? `$${price.monthly}`
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
              props.dictionary.landing.pricing.tiers[1].bullets_heading,
            bullets: props.dictionary.landing.pricing.tiers[1].bullets,
            slot_button: (
              <UiButton on_click={() => {}} size="medium">
                {props.dictionary.landing.pricing.tiers[1].button_label}
              </UiButton>
            ),
          },
        ]}
      />
    </>
  )
}

export default Pricing

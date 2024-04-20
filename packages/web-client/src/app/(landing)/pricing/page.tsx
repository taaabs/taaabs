'use client'

import { PageHero as UiLandingSection_PageHero } from '@web-ui/components/landing/sections/page-hero'
import { PricingTiers as UiLandingSectionPricingTiers } from '@web-ui/components/landing/sections/pricing-tiers'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { useState } from 'react'

enum BillingCycle {
  MONTHLY,
  YEARLY,
}

const Page: React.FC = () => {
  const [billing_cycle, set_billing_cycle] = useState<BillingCycle>(
    BillingCycle.YEARLY,
  )

  let basic_price: number
  switch (billing_cycle) {
    case BillingCycle.YEARLY:
      basic_price = 4
      break
    case BillingCycle.MONTHLY:
      basic_price = 5
      break
  }

  let pro_price: number
  switch (billing_cycle) {
    case BillingCycle.YEARLY:
      pro_price = 6
      break
    case BillingCycle.MONTHLY:
      pro_price = 8
      break
  }

  return (
    <>
      <UiLandingSection_PageHero
        heading="Pricing"
        subheading={<>Start free, upgrade anytime. No credit card required.</>}
      />
      <UiLandingSectionPricingTiers
        billing_cycle={{
          labels: {
            monthly: 'Monthly',
            yearly: 'Yearly',
          },
          on_click: () => {
            if (billing_cycle == BillingCycle.MONTHLY) {
              set_billing_cycle(BillingCycle.YEARLY)
            } else {
              set_billing_cycle(BillingCycle.MONTHLY)
            }
          },
          is_monthly_selected: billing_cycle == BillingCycle.MONTHLY,
          yearly_savings: 'Up to -25%',
        }}
        pricing_tiers={[
          {
            name: 'Free',
            description: 'The start of your journey',
            price: '$0',
            bullets_heading: "What's included:",
            bullets: [
              'Unlimited bookmarks',
              'Unlimited tags',
              'End-to-end encryption',
            ],
            slot_button: (
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Start for free
              </UiCommonParticle_Button>
            ),
          },
          {
            name: 'Lite',
            description: 'Affordable plan with our must haves',
            price: `$${basic_price}`,
            price_info: {
              first_line: 'per month',
              second_line:
                billing_cycle == BillingCycle.YEARLY
                  ? 'billed yearly'
                  : 'billed monthly',
            },
            bullets_heading: 'Everyting in Free, plus:',
            bullets: ['Multi-link bookmarks', 'Mark as unread', 'Dark mode'],
            slot_button: (
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Subscribe to Lite
              </UiCommonParticle_Button>
            ),
          },
          {
            name: 'Pro',
            description: 'Get the most out of Taaabs',
            price: `$${pro_price}`,
            price_info: {
              first_line: 'per month',
              second_line:
                billing_cycle == BillingCycle.YEARLY
                  ? 'billed yearly'
                  : 'billed monthly',
            },
            bullets_heading: 'Everyting in Lite, plus:',
            bullets: [
              'Power user superpowers',
              'Priority support',
              'Claim shorter username',
            ],
            has_best_value: true,
            slot_button: (
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Subscribe to Pro
              </UiCommonParticle_Button>
            ),
          },
        ]}
      />
    </>
  )
}

export default Page

'use client'

import { PageHero as UiLandingSection_PageHero } from '@web-ui/components/landing/sections/page-hero'
import { PricingTiers as UiLandingSectionPricingTiers } from '@web-ui/components/landing/sections/pricing-tiers'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { useState } from 'react'

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

const Page: React.FC = () => {
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
          yearly_savings: '-20%',
        }}
        pricing_tiers={[
          {
            name: 'Free',
            description: 'Start building your personal library',
            price: '$0',
            bullets_heading: "What's included:",
            bullets: [
              'Unlimited bookmarks',
              'Unlimited tags',
              'Zero-knowledge encryption™',
            ],
            slot_button: (
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Start for free
              </UiCommonParticle_Button>
            ),
          },
          {
            name: 'Basic',
            description: 'Affordable plan with our must haves',
            previous_price:
              billing_cycle == BillingCycle.YEARLY
                ? `$${price.monthly.lite}`
                : undefined,
            price: `$${lite_price}`,
            price_info: {
              first_line: 'per month',
              second_line:
                billing_cycle == BillingCycle.YEARLY
                  ? 'billed yearly'
                  : 'billed monthly',
            },
            bullets_heading: 'Everything in Free, plus:',
            bullets: [
              'Add-on: Mark as unread',
              'Add-on: Extra sort options',
              'Add-on: Multi-link bookmarks',
            ],
            slot_button: (
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Subscribe to Basic
              </UiCommonParticle_Button>
            ),
          },
          {
            name: 'Premium',
            description: 'Get the most out of Taaabs',
            previous_price:
              billing_cycle == BillingCycle.YEARLY
                ? `$${price.monthly.pro}`
                : undefined,
            price: `$${pro_price}`,
            price_info: {
              first_line: 'per month',
              second_line:
                billing_cycle == BillingCycle.YEARLY
                  ? 'billed yearly'
                  : 'billed monthly',
            },
            bullets_heading: 'Everything in Basic, plus:',
            bullets: [
              'Unlock all addons ✨',
              'Get priority support',
              'Claim shorter username',
            ],
            featured_text: 'recommended',
            slot_button: (
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Subscribe to Premium
              </UiCommonParticle_Button>
            ),
          },
        ]}
      />
    </>
  )
}

export default Page

'use client'

import { PageHero as UiLandingSection_PageHero } from '@web-ui/components/landing/sections/page-hero'
import { PricingTier as UiLandingAtom_PricingTier } from '@web-ui/components/landing/atoms/pricing-tier'
import { PricingTiers as UiLandingTemplate_PricingTiers } from '@web-ui/components/landing/templates/pricing-tiers'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { useState } from 'react'

const Page: React.FC = () => {
  const [billing_cycle, set_billing_cycle] = useState<'yearly' | 'monthly'>(
    'yearly',
  )

  let basic_price: number
  switch (billing_cycle) {
    case 'yearly':
      basic_price = 4
      break
    case 'monthly':
      basic_price = 5
      break
  }

  let pro_price: number
  switch (billing_cycle) {
    case 'yearly':
      pro_price = 6
      break
    case 'monthly':
      pro_price = 8
      break
  }

  return (
    <>
      <UiLandingSection_PageHero
        heading="Pricing"
        subheading={<>Start free, upgrade anytime. No credit card required.</>}
      />
      <UiLandingTemplate_PricingTiers>
        <>
          <UiLandingAtom_PricingTier
            name="Free"
            description="The start of your journey"
            price="$0"
            bullets_heading="What's included:"
            bullets={['Unlimited bookmarks', 'End-to-end encryption']}
            slot_button={
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Start for free
              </UiCommonParticle_Button>
            }
          />
          <UiLandingAtom_PricingTier
            name="Basic"
            description="Affordable plan with must haves"
            price={`$${basic_price}`}
            price_info={{
              first_line: 'per month',
              second_line:
                billing_cycle == 'yearly' ? 'billed yearly' : 'billed monthly',
            }}
            bullets_heading="Everyting in Free, plus:"
            bullets={['Multi-link bookmarks', 'Dark mode']}
            slot_button={
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Subscribe to Basic
              </UiCommonParticle_Button>
            }
          />
          <UiLandingAtom_PricingTier
            name="Pro"
            description="Get the most out of Taaabs"
            price={`$${pro_price}`}
            price_info={{
              first_line: 'per month',
              second_line:
                billing_cycle == 'yearly' ? 'billed yearly' : 'billed monthly',
            }}
            bullets_heading="Everyting in Basic, plus:"
            bullets={['Power user superpowers', 'Claim shorter username']}
            is_featured={true}
            slot_button={
              <UiCommonParticle_Button on_click={() => {}} size="medium">
                Subscribe to Pro
              </UiCommonParticle_Button>
            }
          />
        </>
      </UiLandingTemplate_PricingTiers>
    </>
  )
}

export default Page

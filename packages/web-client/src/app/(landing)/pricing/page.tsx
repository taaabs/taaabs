import { PageHero as UiLandingAtom_PageHero } from '@web-ui/components/landing/atoms/page-hero'
import { PricingTier as UiLandingAtom_PricingTier } from '@web-ui/components/landing/atoms/pricing-tier'
import { PricingTiers as UiLandingTemplate_PricingTiers } from '@web-ui/components/landing/templates/pricing-tiers'

const Page: React.FC = () => {
  return (
    <>
      <UiLandingAtom_PageHero
        heading="Pricing"
        subheading={<>Start free, upgrade anytime. No credit card required.</>}
      />
      <UiLandingTemplate_PricingTiers
        slot_left_side={
          <UiLandingAtom_PricingTier
            name="Free"
            description="The start of your social bookmarking journey"
            price="Literally $0"
            price_info="Free forever"
            bullets={['Unlimited bookmarks & tags', 'End-to-end encryption']}
          />
        }
        slot_right_side={
          <UiLandingAtom_PricingTier
            name="Pro"
            description="Unlock a new level of your Taaabs experience"
            price="$29.99"
            price_duration="Year"
            price_info="12 months at $2.49/mo. Save 50%"
            bullets={[
              'Unlimited usage of all features',
              'Claim shorter username',
            ]}
          />
        }
      />
    </>
  )
}

export default Page

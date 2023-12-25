import { PageHero } from '@web-ui/components/landing/atoms/page-hero'
import { PricingTier } from '@web-ui/components/landing/atoms/pricing-tier'
import { PricingTiers } from '@web-ui/components/landing/templates/pricing-tiers'

const Page: React.FC = () => {
  return (
    <>
      <PageHero
        heading="Pricing"
        subheading={
          <>
            Embrace the Web without breaking your bank.
            <br />
            Start free, upgrade anytime. No credit card required.
          </>
        }
      />
      <PricingTiers
        slot_left_side={
          <PricingTier
            name="Free"
            description="Organize your bookmarks right away"
            price="Literally $0"
            price_info="Free forever"
            bullets={[
              'Unlimited bookmarks',
              'Unlimited tags',
              'End-to-end encryption',
            ]}
          />
        }
        slot_right_side={
          <PricingTier
            name="Premium"
            description="Get the most out of Taaabs"
            price="$29.99"
            price_duration="Year"
            price_info="12 months at $2.49/mo. Save 50%"
            bullets={[
              'All personal library features',
              'Dark mode',
              'Claim shorter username',
            ]}
          />
        }
      />
    </>
  )
}

export default Page

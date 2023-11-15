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
            description="Organize your bookmark collection right away"
            price="Literally $0"
            price_info="Free forever"
            bullets={[
              'Unlimited public/private bookmarks',
              'Unlimited tags',
              'Essential personal library features',
              'Personal library free of tracking and ads',
            ]}
          />
        }
        slot_right_side={
          <PricingTier
            name="Plus"
            description="Take your browsing experience to the next level"
            price="$4"
            price_info="$40 billed annually"
            bullets={[
              'Everyting in Free',
              'Personal library gets all features',
              'E2E encrypted bookmarks (soon)',
              'Claim shorter username',
            ]}
          />
        }
      />
    </>
  )
}

export default Page

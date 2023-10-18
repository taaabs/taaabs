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
            price="$0"
            price_info="Free forever"
            bullets={[
              'Unlimited public/private bookmarks',
              'Unlimited tags',
              'Essential features for private saves',
              'Free of tracking and ads',
            ]}
          />
        }
        slot_right_side={
          <PricingTier
            name="Plus"
            description="Take your browsing experience to the next level"
            price="$3"
            price_info="$30 billed annually"
            bullets={[
              'Everyting in Free',
              'Private saves gets all features',
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

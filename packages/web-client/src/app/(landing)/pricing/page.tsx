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
            description="Organize your bookmark collection right away, no matter its size"
            price="$0"
            price_info="Free forever"
            bullets={[
              'Unlimited public/private bookmarks',
              'Unlimited tags',
              'All essential features',
              'Free of third-party tracking',
              'Free of ads',
            ]}
          />
        }
        slot_right_side={
          <PricingTier
            name="Plus"
            description="Take your bookmarking experience to the next level with our beloved, useful Plus features"
            price="Less than $1"
            price_info="$11 billed annually"
            bullets={[
              'Everyting in Free',
              'Tag counts',
              'Extra library capabilities',
              'Claim shorter username',
              "It's free if you cannot afford it",
            ]}
          />
        }
      />
    </>
  )
}

export default Page

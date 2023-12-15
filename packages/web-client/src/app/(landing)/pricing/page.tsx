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
              'Unlimited bookmarks and tags',
              'End-to-end encryption',
              'No ads. No trackers. No kidding.',
            ]}
          />
        }
        slot_right_side={
          <PricingTier
            name="Premium"
            description="Get the most out of Taaabs"
            price="$4.99"
            price_info="$44.99 billed annually"
            bullets={[
              'All library add-ons',
              'Claim shorter username',
              'Official stickers',
            ]}
          />
        }
      />
    </>
  )
}

export default Page

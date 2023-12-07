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
              'Unlimited encrypted bookmarks',
              'Unlimited tags and folders',
              'Essential view options',
              'Personal library free of ads',
            ]}
          />
        }
        slot_right_side={
          <PricingTier
            name="Premium"
            description="Take your browsing experience to the next level"
            price="$3.99"
            price_info="$39.99 billed annually"
            bullets={[
              'All view options',
              'Unlimited categories',
              'Full-text search',
              'Notes, highlights and reminders',
            ]}
          />
        }
      />
    </>
  )
}

export default Page

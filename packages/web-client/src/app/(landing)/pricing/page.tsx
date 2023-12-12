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
              'Unlimited bookmarks',
              'Unlimited tags',
              'Essential view options',
              'No ads. No trackers. No kidding.',
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
              'Power-user view options',
              'Categories and folders',
              'Notes, highlights and reminders',
              'Multi-link bookmarks',
            ]}
          />
        }
      />
    </>
  )
}

export default Page

import { PageHero } from '@web-ui/components/landing/atoms/page-hero'
import { PricingTier } from '@web-ui/components/landing/atoms/pricing-tier'
import { PricingTiers } from '@web-ui/components/landing/templates/pricing-tiers'

const Page: React.FC = () => {
  return (
    <>
      <PageHero
        heading="Pricing"
        subheading={
          <p>
            Embrace the Web without breaking your bank.
            <br />
            Start free, upgrade anytime. No credit card required.
          </p>
        }
      />
      <PricingTiers
        leftSlot={
          <PricingTier
            name="Free"
            description="Organize your bookmark collection right away"
            price="$0"
            priceInfo="Free forever"
            bullets={[
              'Unlimited public/private bookmarks',
              'Unlimited tags',
              'Essential library features',
              'Tracking & Ad free library',
              'Always free',
            ]}
          />
        }
        rightSlot={
          <PricingTier
            name="Plus"
            description="Get the most ouf of taaabs with additional features"
            price="Less than $1"
            priceInfo="$11 billed annually"
            bullets={[
              'Library feature: Categories',
              'Library feature: Sort by saves count',
              'Library feature: Tag counts',
              'Account: Shorter username',
              "It's free if you cannot afford it",
            ]}
          />
        }
      />
    </>
  )
}

export default Page

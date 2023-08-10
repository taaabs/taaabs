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
            description="Start organizing your bookmark collection right away, no matter its size"
            price="$0"
            priceInfo="Free forever"
            bullets={[
              'Unlimited public/private bookmarks',
              'Unlimited tags and folders',
              'One parent, one child category',
              'Essential view options of private links',
            ]}
          />
        }
        rightSlot={
          <PricingTier
            name="Plus"
            description="Create ∞ categories and get the most ouf of taaabs with your private bookmarks"
            price="Less than $1"
            priceInfo="$10 billed annually"
            bullets={[
              'Everything in Free',
              'Unlimited categories',
              'Fully-featured view options of private links',
              "It's free if you cannot afford it*",
            ]}
          />
        }
      />
    </>
  )
}

export default Page

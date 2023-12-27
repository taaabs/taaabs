import { Ui } from '@web-ui'

const Page: React.FC = () => {
  return (
    <>
      <Ui.Landing.Atoms.PageHero
        heading="Pricing"
        subheading={
          <>
            Supercharge your personal library with Premium Features.
            <br />
            Start free, upgrade anytime. No credit card required.
          </>
        }
      />
      <Ui.Landing.Templates.PricingTiers
        slot_left_side={
          <Ui.Landing.Atoms.PricingTier
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
          <Ui.Landing.Atoms.PricingTier
            name="Premium"
            description="Get the most out of Taaabs"
            price="$29.99"
            price_duration="Year"
            price_info="12 months at $2.49/mo. Save 50%"
            bullets={[
              'Personal Library Premium™',
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

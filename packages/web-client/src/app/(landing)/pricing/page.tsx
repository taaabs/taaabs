import { PageHero } from '@web-ui/components/landing/atoms/page-hero'

const Page: React.FC = () => {
  return (
    <>
      <PageHero
        heading="Pricing"
        subheading={
          <p>
            Embrace the Web without breaking your bank.
            <br />
            Start free, upgrade anytime, no credit card required.
          </p>
        }
      />
    </>
  )
}

export default Page

import { HomeHero } from '@web-ui/components/landing/atoms/home-hero'
import Link from 'next/link'

const Page: React.FC = () => {
  return (
    <>
      <HomeHero
        heading="Next-gen social bookmarking"
        subheading={
          <>
            <p>
              We build taaabs to empower everyone to <span>organize</span>,{' '}
              <span>preserve</span> and <span>stay up to date</span> with
              resources of the Web reliably and efficiently.
            </p>

            <p>
              You can create a public library of your findings — let others
              browse it and subscribe to its updates{' '}
              <span>or keep everything completely private</span>.
            </p>
          </>
        }
      />
      <div>
        <Link href="/test_user">test_user</Link>
      </div>
    </>
  )
}

export default Page

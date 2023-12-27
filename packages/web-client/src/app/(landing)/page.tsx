import { Ui } from '@web-ui'
import Link from 'next/link'

const Page: React.FC = () => {
  return (
    <>
      <Ui.Landing.Atoms.HomeHero
        heading="Your personal library, organized."
        subheading={
          <p>
            <strong>
              The easiest way to save and find what matters to you.
            </strong>
            <br />
            Taaabs is a privacy focused bookmark manager with nifty social
            features.
          </p>
        }
      />
      <div>
        <Link href="/test_user">test_user</Link>
      </div>
    </>
  )
}

export default Page

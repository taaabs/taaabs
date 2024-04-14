import { PageHero } from './page-hero'

export default {
  component: PageHero,
}

export const Primary = () => (
  <PageHero heading="Lorem ipsum" subheading={<p>Lorem ipsum</p>} />
)

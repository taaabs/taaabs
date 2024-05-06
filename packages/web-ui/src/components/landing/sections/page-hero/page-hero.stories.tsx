import { PageHero } from './page-hero'

export default {
  component: PageHero,
}

export const Primary = () => (
  <PageHero text="Lorem ipsum" subtext={<p>Lorem ipsum</p>} />
)
